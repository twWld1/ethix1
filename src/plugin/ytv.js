import ytdl from 'ytdl-core';
import { spawn } from 'child_process';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const videoMap = new Map();
let videoIndex = 1;

const qualities = ['144p', '240p', '360p', '480p', '720p', '1080p'];

const song = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['ytv'];

  if (validCommands.includes(cmd)) {
    if (!text || !ytdl.validateURL(text)) {
      return m.reply('Please provide a valid YouTube URL.');
    }

    try {
      await m.React("🕘");

      const info = await ytdl.getInfo(text);

      const videoDetails = {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        views: info.videoDetails.viewCount,
        likes: info.videoDetails.likes,
        uploadDate: formatDate(info.videoDetails.uploadDate),
        duration: formatDuration(info.videoDetails.lengthSeconds),
        thumbnailUrl: info.videoDetails.thumbnails[0].url,
        videoUrl: info.videoDetails.video_url
      };

      const qualityButtons = qualities.map((quality, index) => {
        const uniqueId = videoIndex + index;
        videoMap.set(uniqueId, { quality, videoId: info.videoDetails.videoId, ...videoDetails });
        return {
          "header": "",
          "title": `${quality}`,
          "description": `Select ${quality} quality`,
          "id": `quality_${uniqueId}`
        };
      });

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `Video Downloader\n*🔍Title:* ${videoDetails.title}\n*✍️ Author:* ${videoDetails.author}\n*🥸Views:* ${videoDetails.views}\n*👍 Likes:* ${videoDetails.likes}\n*📆 Upload Date:* ${videoDetails.uploadDate}\n*🏮 Duration:* ${videoDetails.duration}\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© Powered By Ethix-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: videoDetails.thumbnailUrl } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "🎬 Select a video quality",
                      sections: [
                        {
                          title: "📥 Available Qualities",
                          highlight_label: "💡 Choose Quality",
                          rows: qualityButtons
                        },
                      ]
                    })
                  },
                ],
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363249960769123@newsletter',
                  newsletterName: "Ethix-MD",
                  serverMessageId: 143
                }
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("✅");

      videoIndex += qualities.length;
    } catch (error) {
      console.error("Error processing your request:", error);
      m.reply('Error processing your request.');
      await m.React("❌");
    }
  } else if (selectedId) {
    const key = parseInt(selectedId.replace('quality_', ''));
    const selectedQuality = videoMap.get(key);

    if (selectedQuality) {
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${selectedQuality.videoId}`;
        const info = await ytdl.getInfo(videoUrl);
        const videoFormat = info.formats.find(f => f.qualityLabel === selectedQuality.quality && f.hasVideo);
        const audioFormat = info.formats.find(f => f.qualityLabel === selectedQuality.quality && f.hasAudio);

        if (!videoFormat || !audioFormat) {
          throw new Error(`Format not found for quality: ${selectedQuality.quality}`);
        }

        const videoStream = ytdl(videoUrl, { format: videoFormat });
        const audioStream = ytdl(videoUrl, { format: audioFormat });

        const videoBuffer = await streamToBuffer(videoStream);
        const audioBuffer = await streamToBuffer(audioStream);

        const mergedBuffer = await mergeAudioAndVideo(audioBuffer, videoBuffer);

        await Matrix.sendMessage(m.from, {
          document: mergedBuffer,
          mimetype: 'video/mp4',
          fileName: `${selectedQuality.title}.mp4`,
          caption: `> © Powered By Ethix-MD`
        }, {
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: selectedQuality.title,
              body: "Ethix-MD",
              thumbnailUrl: selectedQuality.thumbnailUrl,
              sourceUrl: selectedQuality.videoUrl,
              mediaType: 1,
              renderLargerThumbnail: true
            },
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363249960769123@newsletter',
              newsletterName: "Ethix-MD",
              serverMessageId: 143
            }
          },
          quoted: m
        });
      } catch (error) {
        console.error("Error fetching video details:", error);
        m.reply('Error fetching video details.');
      }
    }
  }
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

const mergeAudioAndVideo = async (audioBuffer, videoBuffer) => {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = spawn('ffmpeg', [
      '-i', 'pipe:0',         // input from stdin
      '-i', 'pipe:1',         // input from stdin
      '-codec', 'copy',       // copy codec
      '-shortest',            // stop encoding when the shortest clip ends
      '-f', 'mp4',            // output format
      'pipe:2'                // output to stdout
    ]);

    ffmpegProcess.on('error', (err) => {
      reject(err);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });

    // Pipe audio and video buffers into ffmpeg stdin
    ffmpegProcess.stdin.write(audioBuffer);
    ffmpegProcess.stdin.write(videoBuffer);
    ffmpegProcess.stdin.end();
  });
};

export default song;
