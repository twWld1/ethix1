const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (cmd === "ping") {
    const initial = new Date().getTime();
    await m.react('⚡');
    const final = new Date().getTime();

    const text = `*_🔥⃝вσт ѕρєє∂: ${(final - initial)} ms_*`;
    await sock.sendMessage(m.from, { text }, { quoted: m });
  }
}

export default ping;
