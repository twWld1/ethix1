import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, conn) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const uptimeMessage = `*🤖 ETHIX-MD Status Overview*
_______________________

*📆 ${days} Day*
*🕰️ ${hours} Hour*
*⏳ ${minutes} Minute*
*⏲️ ${seconds} Second*
_______________________
`;

  const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: uptimeMessage
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "© Powered by 𝞢𝙏𝞖𝞘𝞦-𝞛𝘿"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "Ethix-MD Status",
            subtitle: "Uptime",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: "{\"display_text\":\"Menu\",\"id\":\".menu\"}"
              },
              {
                name: "quick_reply",
                buttonParamsJson: "{\"display_text\":\"Ping\",\"id\":\".ping\"}"
              }
            ]
          })
        })
      }
    }
  };

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });
};

export default alive;
