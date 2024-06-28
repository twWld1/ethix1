import { performance } from 'perf_hooks';

// Function to get the uptime in a human-readable format
const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

// Function to measure ping
const measurePing = async () => {
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulating some async operation
  const end = performance.now();
  return Math.round(end - start);
};

// Main command function
const serverStatusCommand = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (['alive', 'uptime', 'runtime', 'ping'].includes(cmd)) {
    const uptime = getUptime();
    const ping = await measurePing();

    try {
      // Create the status message
      const statusMessage = `_Ethix-MD Status_\n\n*📆 ${uptime.days} Day*\n\nn*🕰️ ${uptime.hours} Hour*\n\nn*⏳ ${uptime.minutes} Minute*\n\n*⏲️ ${uptime.seconds} Second*\n\n> © Powered by 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿`;

      await Matrix.sendMessage(m.from, { text: statusMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default serverStatusCommand;
