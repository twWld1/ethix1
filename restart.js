const { exec } = require('child_process');
const path = require('path');

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

function restartServer() {
    console.log('Restarting server...');
    exec('node ' + path.resolve(__dirname, 'index.js'), (err, stdout, stderr) => {
        if (err) {
            console.error(`Error restarting server: ${err.message}`);
            return;
        }
        console.log(`Server restarted successfully:\n${stdout}`);
    });
}

// Start the server initially
restartServer();

// Restart the server if it exits
process.on('exit', () => {
    restartServer();
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('SIGTERM', () => {
    process.exit();
});
