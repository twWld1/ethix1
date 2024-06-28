import { spawn } from 'child_process';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

function startServer() {
    const server = spawn('node', [path.join(__dirname, 'src/index.js')], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    server.on('exit', (code) => {
        if (code !== 0) {
            console.log('Server crashed. Restarting...');
            startServer();
        }
    });
}

startServer();
