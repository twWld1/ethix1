import ytSearch from 'yt-search';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;
import ytdl from '@distube/ytdl-core';

const searchResultsMap = new Map();
let searchIndex = 1;

const playcommand = async (m, Matrix) => {
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

  const validCommands = ['play'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('Please provide a search query.');
    }

    try {
      await m.React("🕘");

      const searchResults = await ytSearch(text);
      const videos = searchResults.videos.slice(0, 5);

      if (videos.length === 0) {
        m.reply('No results found.');
        await m.React("❌");
        return;
      }

      videos.forEach((video, index) => {
        const uniqueId = searchIndex + index;
        searchResultsMap.set(uniqueId, video);
      });

      const currentResult = searchResultsMap.get(searchIndex);
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎧 AUDIO",
            id: `media_audio_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎥 VIDEO",
            id: `media_video_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎵 AUDIO DOCUMENT",
            id: `media_audiodoc_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎦 VIDEO DOCUMENT",
            id: `media_videodoc_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "⏩ NEXT",
            id: `next_${searchIndex + 1}`
          })
        }
      ];

      const thumbnailUrl = currentResult.thumbnail;

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*𝞢𝙏𝞖𝞘𝞦-𝞛𝘿 YOUTUBE SEARCH*\n\n*🔍TITLE:* ${currentResult.title}\n*✍️AUTHOR:* ${currentResult.author.name}\n*🥸 VIEWS:* ${currentResult.views}\n*🏮 DURATION:* ${currentResult.timestamp}\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© Powered By 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: thumbnailUrl } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("✅");

      searchIndex += 1;
    } catch (error) {
      console.error("Error processing your request:", error);
      m.reply('Error processing your request.');
      await m.React("❌");
    }
  } else if (selectedId) {
    if (selectedId.startsWith('next_')) {
      const nextIndex = parseInt(selectedId.replace('next_', ''));
      const currentResult = searchResultsMap.get(nextIndex);

      if (!currentResult) {
        return m.reply('No more results.');
      }
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎧 AUDIO",
            id: `media_audio_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎥 VIDEO",
            id: `media_video_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎵 AUDIO DOCUMENT",
            id: `media_audiodoc_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎦 VIDEO DOCUMENT",
            id: `media_videodoc_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "⏩ NEXT",
            id: `next_${nextIndex + 1}`
          })
        }
      ];

      const thumbnailUrl = currentResult.thumbnail;

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*𝞢𝙏𝞖𝞘𝞦-𝞛𝘿 YOUTUBE SEARCH*\n\n*🔍TITLE:* ${currentResult.title}\n*✍️ AUTHOR:* ${currentResult.author.name}\n*🥸 VIEWS:* ${currentResult.views}\n*🏮 DURATION:* ${currentResult.timestamp}\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© Powered By 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: thumbnailUrl } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
    } else if (selectedId.startsWith('media_')) {
      const parts = selectedId.split('_');
      const type = parts[1];
      const key = parseInt(parts[2]);
      const selectedMedia = searchResultsMap.get(key);

      if (selectedMedia) {
        try {
          const videoUrl = selectedMedia.url;
          let finalMediaBuffer, mimeType, content;

          const stream = ytdl(videoUrl, { filter: type === 'audio' || type === 'audiodoc' ? 'audioonly' : 'videoandaudio' });

          finalMediaBuffer = await getStreamBuffer(stream);
          mimeType = type === 'audio' || type === 'audiodoc' ? 'audio/mpeg' : 'video/mp4';

          const fileSizeInMB = finalMediaBuffer.length / (1024 * 1024);

          if ((type === 'audio' || type === 'video') && fileSizeInMB <= 300) {
          content = {
            [type]: finalMediaBuffer,
            mimetype: mimeType,
            caption: `Downloaded by 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿`
          };
        } else {
          content = {
            document: finalMediaBuffer,
            mimetype: mimeType,
            fileName: `${selectedVideo.title}.${type === 'audio' ? 'mp3' : 'mp4'}`,
            caption: `> *© POWERED BY ETHIX-MD*`
          };
        }

        await Matrix.sendMessage(m.from, content, {
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: `${selectedVideo.title}`,
              body: 'Ethix-MD',
              thumbnailUrl: `${selectedVideo.thumbnail}`,
              sourceUrl: `${selectedVideo.video_url}`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });
        } catch (error) {
          console.error("Error processing your request:", error);
          m.reply('Error processing your request.');
          await m.React("❌");
        }
      }
    }
  }
};

const getStreamBuffer = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', err => reject(err));
  });
};

export default playcommand;
