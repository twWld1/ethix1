import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Make sure to use node-fetch
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Get the absolute path for the chat history file
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, '../gpt_history.json');

const mistralSystemPrompt = "you are a good assistant.";

// Utility function to read chat history from file
async function readChatHistoryFromFile() {
    try {
        const data = await fs.readFile(chatHistoryFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Utility function to write chat history to file
async function writeChatHistoryToFile(chatHistory) {
    try {
        await fs.writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (err) {
        console.error('Error writing chat history to file:', err);
    }
}

// Utility function to update chat history
async function updateChatHistory(chatHistory, sender, message) {
    if (!chatHistory[sender]) {
        chatHistory[sender] = [];
    }
    chatHistory[sender].push(message);
    if (chatHistory[sender].length > 20) {
        chatHistory[sender].shift();
    }
    await writeChatHistoryToFile(chatHistory);
}

// Utility function to delete user's chat history
async function deleteChatHistory(chatHistory, userId) {
    delete chatHistory[userId];
    await writeChatHistoryToFile(chatHistory);
}

const mistral = async (m, Matrix) => {
    const chatHistory = await readChatHistoryFromFile();
    const text = m.body.toLowerCase();

    if (text === "/forget") {
        await deleteChatHistory(chatHistory, m.sender);
        await Matrix.sendMessage(m.from, { text: 'Conversation deleted successfully' }, { quoted: m });
        return;
    }

    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const prompt = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    const validCommands = ['gf', 'girl', 'gfgpt'];

    if (validCommands.includes(cmd)) {
        if (!prompt) {
            await Matrix.sendMessage(m.from, { text: 'Please give me a prompt' }, { quoted: m });
            return;
        }

        try {
            const senderChatHistory = chatHistory[m.sender] || [];
            const historyPrompt = senderChatHistory.map(entry => entry.content).join('\n');
            const combinedPrompt = `${mistralSystemPrompt}\n${historyPrompt}\nUser: ${prompt}`;

            await m.React("⏳");

            const apiUrl = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(combinedPrompt)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const answer = responseData.answer;

            await updateChatHistory(chatHistory, m.sender, { role: "user", content: prompt });
            await updateChatHistory(chatHistory, m.sender, { role: "assistant", content: answer });

            // Find all code blocks in the response
            const codeMatches = answer.match(/```([\s\S]*?)```/g);

            if (codeMatches) {
                for (const codeMatch of codeMatches) {
                    const code = codeMatch.replace(/```/g, '');

                    let msg = generateWAMessageFromContent(m.from, {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    body: proto.Message.InteractiveMessage.Body.create({
                                        text: answer
                                    }),
                                    footer: proto.Message.InteractiveMessage.Footer.create({
                                        text: "> © Powered By Ethix-MD"
                                    }),
                                    header: proto.Message.InteractiveMessage.Header.create({
                                        title: "",
                                        subtitle: "",
                                        hasMediaAttachment: false
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [
                                            {
                                                name: "cta_copy",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "Copy Your Code",
                                                    id: "copy_code",
                                                    copy_code: code
                                                })
                                            }
                                        ]
                                    })
                                })
                            }
                        }
                    }, {});

                    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
                        messageId: msg.key.id
                    });
                }
            } else {
                await Matrix.sendMessage(m.from, { text: answer }, { quoted: m });
            }

            await m.React("✅");
        } catch (err) {
            await Matrix.sendMessage(m.from, { text: "Something went wrong" }, { quoted: m });
            console.error('Error: ', err);
            await m.React("❌");
        }
    }
};

export default mistral;
