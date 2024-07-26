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

      const isUrl = text.includes('youtube.com/watch?v=') || text.includes('youtu.be/');
      await m.React("⬇️");

      const sendVideoMessage = async (videoInfo, videoBuffer) => {
        const messageContent = {
          [cmd === 'ytmp4doc' ? 'document' : 'video']: videoBuffer,
          mimetype: 'video/mp4',
          fileName: `${videoInfo.title}.mp4`,
          caption: `> ${videoInfo.title}\n> © Powered by 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿`,
        };
        await Matrix.sendMessage(m.from, messageContent, { quoted: m });
        await m.React("✅");
      };

      const fetchVideoBuffer = async (url) => {
        const response = await fetch(url);
        return response.buffer();
      };

      if (isUrl) {
        const videoId = text.split('v=')[1] || text.split('youtu.be/')[1];
        const apiUrl = `https://matrix-serverless-api.vercel.app/api/ytdl?url=${encodeURIComponent(text)}&type=video`;

        try {
          const videoInfo = await yts({ videoId });
          const videoBuffer = await fetchVideoBuffer(apiUrl);
          await sendVideoMessage(videoInfo, videoBuffer);
        } catch (err) {
          console.error('Error sending video:', err);
          m.reply('Error sending video.');
          await m.React("❌");
        }
      } else {
        const searchResult = await yts(text);
        const firstVideo = searchResult.videos[0];
        await m.React("⬇️");

        if (!firstVideo) {
          m.reply('Video not found.');
          await m.React("❌");
          return;
        }

        const apiUrl = `https://matrix-serverless-api.vercel.app/api/ytdl?url=${encodeURIComponent(firstVideo.url)}&type=video`;

        try {
          const videoBuffer = await fetchVideoBuffer(apiUrl);
          await sendVideoMessage(firstVideo, videoBuffer);
        } catch (err) {
          console.error('Error sending video:', err);
          m.reply('Error sending video.');
          await m.React("❌");
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      m.reply('An error occurred while processing your request.');
      await m.React("❌");
    }
  }
};

export default video;
