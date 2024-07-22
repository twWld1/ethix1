import fetch from 'node-fetch';
import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const handleMessage = async (m, Matrix) => {
    const text = m.body.toLowerCase();

    if (/play.*song|gana|chalao/.test(text)) {
        await handleAIRequest(m, Matrix, text, 'audio');
    } else if (/play.*video|video|dekhna/.test(text)) {
        await handleAIRequest(m, Matrix, text, 'video');
    }
};

const handleAIRequest = async (m, Matrix, text, type) => {
    const prompt = `Suggest a ${type} based on the request: "${text}". Provide only the title and artist.`;

    try {
        await m.React("⏳");

        const response = await fetch('https://matrixcoder.tech/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "text-generation",
                model: "hf/meta-llama/meta-llama-3-8b-instruct",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const mediaName = responseData.result.response.trim();

        if (!mediaName) {
            m.reply(`Could not determine a ${type}.`);
            await m.React("❌");
            return;
        }

        const searchResult = await yts(mediaName);
        const firstVideo = searchResult.videos[0];

        if (!firstVideo) {
            m.reply(`${type.charAt(0).toUpperCase() + type.slice(1)} not found.`);
            await m.React("❌");
            return;
        }

        const mediaStream = ytdl(firstVideo.url, { quality: type === 'audio' ? 'highestaudio' : 'highestvideo' });
        const mediaBuffer = [];

        mediaStream.on('data', (chunk) => {
            mediaBuffer.push(chunk);
        });

        mediaStream.on('end', async () => {
            const finalMediaBuffer = Buffer.concat(mediaBuffer);
            if (type === 'audio') {
                await sendAudioDocument(m, Matrix, firstVideo, finalMediaBuffer);
            } else {
                await sendVideoDocument(m, Matrix, firstVideo, finalMediaBuffer);
            }
        });
    } catch (error) {
        console.error("Error generating response:", error);
        m.reply('Error processing your request.');
        await m.React("❌");
    }
};

const sendAudioDocument = async (m, Matrix, videoInfo, finalAudioBuffer) => {
    const docMessage = {
        document: finalAudioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${videoInfo.title}.mp3`,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: "↺ |◁   II   ▷|   ♡",
                body: `Now playing: ${videoInfo.title}`,
                thumbnailUrl: videoInfo.thumbnail,
                sourceUrl: videoInfo.url,
                mediaType: 1,
                renderLargerThumbnail: false,
            },
        },
    };
    await Matrix.sendMessage(m.from, docMessage, { quoted: m });
    await m.React("✅");
};

const sendVideoDocument = async (m, Matrix, videoInfo, finalVideoBuffer) => {
    const docMessage = {
        document: finalVideoBuffer,
        mimetype: 'video/mp4',
        fileName: `${videoInfo.title}.mp4`,
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: "▶️ Video Document",
                body: `Now playing: ${videoInfo.title}`,
                thumbnailUrl: videoInfo.thumbnail,
                sourceUrl: videoInfo.url,
                mediaType: 1,
                renderLargerThumbnail: false,
            },
        },
    };
    await Matrix.sendMessage(m.from, docMessage, { quoted: m });
    await m.React("✅");
};

export default handleMessage;
