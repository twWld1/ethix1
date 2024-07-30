import axios from 'axios';

const video = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

//  if (!text) return m.reply('Please provide a YouTube URL.');

  try {
    await m.React("🕘");

    let quality;
    let response;

    // Directly determine the API URL based on the command
    if (cmd === 'vid144p') {
      quality = '144p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=144p&apikey=ralph`);
    } else if (cmd === 'vid240p') {
      quality = '240p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=240p&apikey=ralph`);
    } else if (cmd === 'vid360p') {
      quality = '360p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=360p&apikey=ralph`);
    } else if (cmd === 'vid480p') {
      quality = '480p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=ralph`);
    } else if (cmd === 'vid720p') {
      quality = '720p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=720p&apikey=ralph`);
    } else if (cmd === 'vid1080p') {
      quality = '1080p';
      response = await axios.get(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=1080p&apikey=ralph`);
    } else {
  //    return m.reply('Invalid command. Use one of the following: vid144p, vid240p, vid360p, vid480p, vid720p, vid1080p.');
    }

    const videoDetails = response.data;

    if (videoDetails.status) {
      const responseBuffer = await axios.get(videoDetails.data.url, { responseType: 'arraybuffer' });

      const videoMessage = {
        video: Buffer.from(responseBuffer.data),
        mimetype: 'video/mp4',
        caption: `> ${videoDetails.title}\n> © POWERED BY 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿`,
      };

      await Matrix.sendMessage(m.from, videoMessage, { quoted: m });
      await m.React("✅");
    } else {
      m.reply('Video details not found.');
      await m.React("❌");
    }
  } catch (error) {
    console.error("Error generating response:", error);
    m.reply('An error occurred while processing your request.');
    await m.React("❌");
  }
};

export default video;
