import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    jidDecode,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
    getAggregateVotesInPollMessage
} from '@whiskeysockets/baileys';

import { Handler, Callupdate, GroupUpdate } from './event/index.js';
import { Boom } from '@hapi/boom';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import moment from 'moment-timezone';
import axios from 'axios';
import fetch from 'node-fetch';
import * as os from 'os';
import config from '../config.cjs';
import pkg from '../lib/autoreact.cjs';

const { emojis, doReact } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;
const sessionName = "session";
let useStore = false;
let useQR = false;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";
const store = useStore ? makeInMemoryStore({ logger }) : undefined;
const sessionFilePath = path.resolve(__dirname, '../session/session.json');

// Fetch session data from Pastebin if SESSION_ID is provided
async function fetchSessionFromPastebin() {
    if (config.SESSION_ID) {
        const sessionID = config.SESSION_ID.split('Ethix-MD&')[1];
        const pasteUrl = `https://pastebin.com/raw/${sessionID}`;
        const response = await fetch(pasteUrl);
        const text = await response.text();
        if (typeof text === 'string') {
            fs.writeFileSync(sessionFilePath, text);
            console.log('Session file created from Pastebin.');
        }
    }
}

if (fs.existsSync(sessionFilePath)) {
    const savedCreds = JSON.parse(fs.readFileSync(sessionFilePath, 'utf-8'));
    store?.readFromFile(savedCreds);
}

// Save every 1m
setInterval(() => {
    if (store) {
        const sessionData = store.writeToFile();
        fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2));
    }
}, 60000);

const msgRetryCounterCache = new NodeCache();
const P = pino({
    level: "silent"
});

// Baileys Connection Option
async function start() {
    await fetchSessionFromPastebin();

    try {
        let { state, saveCreds } = await useMultiFileAuthState(sessionName);
        let { version, isLatest } = await fetchLatestBaileysVersion();
        console.log("CODED BY GOUTAM KUMAR");
        console.log(`Using WA v${version.join(".")}, isLatest: ${isLatest}`);

        const Matrix = makeWASocket({
            version,
            logger: P,
            printQRInTerminal: useQR,
            browser: Browsers.macOS("Safari"),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P)
            },
            msgRetryCounterCache
        });
        store?.bind(Matrix.ev);

        // Save the session
        Matrix.ev.on("creds.update", saveCreds);

        // Save the session data on update
        Matrix.ev.on('creds.update', () => {
            const sessionData = { creds: state.creds, keys: state.keys };
            fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2));
        });

        // Handle Incoming Messages
        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        // Check Baileys connections
        Matrix.ev.on("connection.update", async update => {
            const { connection, lastDisconnect } = update;

            if (connection === "close") {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                switch (reason) {
                    case DisconnectReason.connectionClosed:
                        console.log(chalk.red("[😩] Connection closed, reconnecting."));
                        start();
                        break;
                    case DisconnectReason.connectionLost:
                        console.log(chalk.red("[🤕] Connection Lost from Server, reconnecting."));
                        start();
                        break;
                    case DisconnectReason.loggedOut:
                        console.log(chalk.red("[😭] Device Logged Out, Please Delete Session and Scan Again."));
                        if (fs.existsSync(sessionFilePath)) {
                            fs.unlinkSync(sessionFilePath);
                        }
                        process.exit();
                        break;
                    case DisconnectReason.restartRequired:
                        console.log(chalk.blue("[♻️] Server Restarting."));
                        start();
                        break;
                    case DisconnectReason.timedOut:
                        console.log(chalk.red("[⏳] Connection Timed Out, Trying to Reconnect."));
                        start();
                        break;
                    default:
                        console.log(chalk.red("[🚫️] Something Went Wrong: Failed to Make Connection"));
                        process.exit();
                }
            }

            if (connection === "open") {
                if (initialConnection) {
                    console.log(chalk.green("😃 Integration Successful️ ✅"));
                    Matrix.sendMessage(Matrix.user.id, { text: `😃 Integration Successful️ ✅` });
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Connection reestablished after restart."));
                }
            }
        });

        // Auto reaction feature
        Matrix.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    console.log(mek);
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto reaction:', err);
            }
        });

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

start();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
