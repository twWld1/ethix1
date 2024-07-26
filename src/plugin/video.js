import fetch from 'node-fetch';
import yts from 'yt-search';

const video = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['video', 'ytmp4', 'vid', 'ytmp4doc'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Give a YouTube URL or search query.');

    try {
      await m.React("🕘");

      const sendVideoMessage = async (videoDetails, videoBuffer) => {
        const messageContent = {
          [cmd === 'ytmp4doc' ? 'document' : 'video']: videoBuffer,
          mimetype: 'video/mp4',
          fileName: `${videoDetails.title}.mp4`,
          caption: `> ${videoDetails.title}\n> © Powered by 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿`,
        };
        await Matrix.sendMessage(m.from, messageContent, { quoted: m });
        await m.React("✅");
      };

      const fetchVideoBuffer = async (url) => {
        const response = await fetch(url);
        return response.buffer();
      };

      const isUrl = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text);
      let videoInfo;

      if (isUrl) {
        videoInfo = await yts({ videoId: new URL(text).searchParams.get('v') });
      } else {
        const searchResult = await yts(text);
        videoInfo = searchResult.videos[0];
        if (!videoInfo) {
          m.reply('Video not found.');
          await m.React("❌");
          return;
        }
      }

      const apiUrl = `https://matrix-serverless-api.vercel.app/api/ytdl?url=${encodeURIComponent(videoInfo.url)}&type=video`;

      const apiResponse = await fetch(apiUrl);
      const { videoDetails, videoURL } = await apiResponse.json();

      const videoBuffer = await fetchVideoBuffer(videoURL);
      await sendVideoMessage(videoDetails, videoBuffer);

    } catch (error) {
      console.error("Error generating response:", error);
      m.reply('An error occurred while processing your request.');
      await m.React("❌");
    }
  }
};

export default video;
