import { writeFile } from "fs/promises";
import fs from 'fs';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from '../../config.cjs';

const gemini = async (m, Matrix) => {
  const API_KEY = config.GEMINI_KEY;

  const command = m.body.split(' ')[0].toLowerCase();
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'gemini') {
    if (!text) {
      return m.reply('Please give me a prompt');
    }
    try {
      const genAI = new GoogleGenerativeAI({ apiKey: API_KEY });
      const thinkingMessage = await Matrix.sendMessage(m.from, { text: "Thinking..." }, { quoted: m });

      async function run() {
        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent({ prompt: text });
        const { key } = thinkingMessage;
        const aires = result.responses[0].text;

        if (m.isGroup) {
          await Matrix.sendMessage(m.from, { text: aires }, { quoted: key });
        } else {
          await Matrix.sendMessage(m.from, { text: aires }, { quoted: key });
        }
      }

      run();
    } catch (error) {
      console.error("Error generating response:", error);
      m.reply("There was an error processing your request.");
    }
  }
};

export default gemini;
