const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (cmd === "ping") {
    const startTime = new Date();
    const text = `*_🔥⃝вσт ѕρєє∂: ${new Date() - startTime} ms_*`;
    await sock.sendMessage(m.from, { text }, { quoted: m });

    await m.React('⚡');
  }
}

export default ping;
