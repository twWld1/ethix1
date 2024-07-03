const quotedMessage = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['q', 'quoted'];

    if (validCommands.includes(cmd)) {
      if (!m.quoted) return m.reply('reply to the message!');

      const quotedObj = await require('../../lib/myfunc').getQuotedObj(m);
      let wokwol = await gss.serialize(quotedObj);
      if (!wokwol.quoted) return m.reply('the replied message does not contain a reply');
      await wokwol.quoted.copyForward(m.from, true);
    }
  } catch (err) {
    console.error(err);
  }
};

export default quotedMessage;