import config from '../../config.cjs';

const modeCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'mode') {
    if (!isCreator) return m.reply("* THIS IS AN OWNER COMMAND*");

    let newMode;
    let responseMessage;
    if (text === 'public') {
      newMode = 'public';
      config.MODE = newMode;
      responseMessage = "Mode has been set to public.";
    } else if (text === 'self') {
      newMode = 'self';
      config.MODE = newMode;
      responseMessage = "Mode has been set to self.";
    } else {
      responseMessage = "Usage:\n- `mode public`: Set mode to public\n- `mode self`: Set mode to self";
    }

    responseMessage += `\nCurrent mode: ${newMode}`;

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
}

export default modeCommand;
