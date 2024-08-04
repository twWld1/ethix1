const _0x37f70a = function () {
  const _0x4afbda = {
    gwmuG: "*Please provide a search query*",
    UczXw: function (_0x27453c, _0x184468) {
      return _0x27453c !== _0x184468;
    },
    zgQXX: "Vewbv",
    kEvcB: "qwgka",
    fxGgV: "BgVOQ"
  };
  _0x4afbda.OXBuM = function (_0x35c2b5, _0x55aefb) {
    return _0x35c2b5 === _0x55aefb;
  };
  _0x4afbda.XiCeY = "ahSki";
  _0x4afbda.xNwtd = "hHasT";
  let _0x375f06 = true;
  return function (_0x3c1997, _0x10f8c3) {
    if (_0x4afbda.OXBuM(_0x4afbda.XiCeY, _0x4afbda.xNwtd)) {
      const _0x4499a0 = _0x38a149.apply(_0x2842dc, arguments);
      _0x5d800f = null;
      return _0x4499a0;
    } else {
      const _0x197f9e = _0x375f06 ? function () {
        if (_0x10f8c3) {
          const _0x5ab0f7 = _0x10f8c3.apply(_0x3c1997, arguments);
          _0x10f8c3 = null;
          return _0x5ab0f7;
        }
      } : function () {};
      _0x375f06 = false;
      return _0x197f9e;
    }
  };
}();
const _0x51746b = _0x37f70a(this, function () {
  return _0x51746b.toString().search("(((.+)+)+)+$").toString().constructor(_0x51746b).search("(((.+)+)+)+$");
});
_0x51746b();
const _0x19a252 = function () {
  let _0x2c0dfd = true;
  return function (_0xab2814, _0x548ed5) {
    const _0x3444c9 = _0x2c0dfd ? function () {
      if (_0x548ed5) {
        const _0x1c5b6e = _0x548ed5.apply(_0xab2814, arguments);
        _0x548ed5 = null;
        return _0x1c5b6e;
      }
    } : function () {};
    _0x2c0dfd = false;
    return _0x3444c9;
  };
}();
(function () {
  _0x19a252(this, function () {
    const _0x712470 = new RegExp("function *\\( *\\)");
    const _0x1629bd = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
    const _0x329c17 = _0x461deb("init");
    if (!_0x712470.test(_0x329c17 + "chain") || !_0x1629bd.test(_0x329c17 + "input")) {
      _0x329c17('0');
    } else {
      _0x461deb();
    }
  })();
})();
(function () {
  let _0x358978;
  try {
    const _0x7ddf3d = Function("return (function() {}.constructor(\"return this\")( ));");
    _0x358978 = _0x7ddf3d();
  } catch (_0x3c335e) {
    _0x358978 = window;
  }
  _0x358978.setInterval(_0x461deb, 4000);
})();
const _0x3d813a = function () {
  let _0x515cf7 = true;
  return function (_0x1a12eb, _0x31abd7) {
    const _0x4ed613 = _0x515cf7 ? function () {
      if (_0x31abd7) {
        const _0x455eaa = _0x31abd7.apply(_0x1a12eb, arguments);
        _0x31abd7 = null;
        return _0x455eaa;
      }
    } : function () {};
    _0x515cf7 = false;
    return _0x4ed613;
  };
}();
const _0x4f2184 = _0x3d813a(this, function () {
  let _0x19022c;
  try {
    const _0xbbeb85 = Function("return (function() {}.constructor(\"return this\")( ));");
    _0x19022c = _0xbbeb85();
  } catch (_0x196d0f) {
    _0x19022c = window;
  }
  const _0x5624b5 = _0x19022c.console = _0x19022c.console || {};
  const _0x51412f = ["log", "warn", "info", "error", "exception", "table", "trace"];
  for (let _0x369fdd = 0; _0x369fdd < _0x51412f.length; _0x369fdd++) {
    const _0x5ca41a = _0x3d813a.constructor.prototype.bind(_0x3d813a);
    const _0x2f44f8 = _0x51412f[_0x369fdd];
    const _0x45b2e3 = _0x5624b5[_0x2f44f8] || _0x5ca41a;
    _0x5ca41a.__proto__ = _0x3d813a.bind(_0x3d813a);
    _0x5ca41a.toString = _0x45b2e3.toString.bind(_0x45b2e3);
    _0x5624b5[_0x2f44f8] = _0x5ca41a;
  }
});
_0x4f2184();
import _0xa89d6d from 'yt-search';
import _0x11d50e from 'ytdl-core';
import _0x3bef14 from '@whiskeysockets/baileys';
const {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia
} = _0x3bef14;
const searchResultsMap = new Map();
let searchIndex = 1;
const playcommand = async (_0x42763f, _0x4f1b2e) => {
  let _0x4dd168;
  const _0x5b1a3f = _0x42763f?.["message"]?.["templateButtonReplyMessage"]?.["selectedId"];
  const _0x1dab4b = _0x42763f?.["message"]?.["interactiveResponseMessage"];
  if (_0x1dab4b) {
    const _0x5525d5 = _0x1dab4b.nativeFlowResponseMessage?.["paramsJson"];
    if (_0x5525d5) {
      const _0x210821 = JSON.parse(_0x5525d5);
      _0x4dd168 = _0x210821.id;
    }
  }
  const _0x723147 = _0x4dd168 || _0x5b1a3f;
  const _0x37b9ac = _0x42763f.body.match(/^[\\/!#.]/);
  const _0x511acd = _0x37b9ac ? _0x37b9ac[0] : '/';
  const _0x8bbda1 = _0x42763f.body.startsWith(_0x511acd) ? _0x42763f.body.slice(_0x511acd.length).split(" ")[0].toLowerCase() : '';
  const _0x4da70d = _0x42763f.body.slice(_0x511acd.length + _0x8bbda1.length).trim();
  const _0x597231 = ["play"];
  if (_0x597231.includes(_0x8bbda1)) {
    if (!_0x4da70d) {
      return _0x42763f.reply("*Please provide a search query*");
    }
    try {
      await _0x42763f.React('🕘');
      const _0x21e8d6 = await _0xa89d6d(_0x4da70d);
      const _0x3475aa = _0x21e8d6.videos.slice(0, 5);
      if (_0x3475aa.length === 0) {
        _0x42763f.reply("No results found.");
        await _0x42763f.React('❌');
        return;
      }
      _0x3475aa.forEach((_0x44ee81, _0x2a2316) => {
        const _0x3a0f47 = searchIndex + _0x2a2316;
        searchResultsMap.set(_0x3a0f47, _0x44ee81);
      });
      const _0x1744f1 = searchResultsMap.get(searchIndex);
      const _0x28524b = [{
        'name': "quick_reply",
        'buttonParamsJson': JSON.stringify({
          'display_text': "🎧 AUDIO",
          'id': "media_audio_" + searchIndex
        })
      }, {
        'name': "quick_reply",
        'buttonParamsJson': JSON.stringify({
          'display_text': "🎥 VIDEO",
          'id': "media_video_" + searchIndex
        })
      }, {
        'name': "quick_reply",
        'buttonParamsJson': JSON.stringify({
          'display_text': "🎵 AUDIO DOCUMENT",
          'id': "media_audiodoc_" + searchIndex
        })
      }, {
        'name': "quick_reply",
        'buttonParamsJson': JSON.stringify({
          'display_text': "🎦 VIDEO DOCUMENT",
          'id': "media_videodoc_" + searchIndex
        })
      }, {
        'name': "quick_reply",
        'buttonParamsJson': JSON.stringify({
          'display_text': "⏩ NEXT",
          'id': "next_" + (searchIndex + 1)
        })
      }];
      const _0x31d2b6 = _0x1744f1.thumbnail;
      const _0x540126 = "https://www.youtube.com/watch?v=" + _0x1744f1.videoId;
      const _0x1394a6 = {
        deviceListMetadata: {},
        deviceListMetadataVersion: 0x2
      };
      const _0x4038ee = {
        text: "*TWORLD-MD YOUTUBE SEARCH*\n\n> *TITLE:* " + _0x1744f1.title + "\n> *AUTHOR:* " + _0x1744f1.author.name + "\n> *VIEWS:* " + _0x1744f1.views + "\n> *DURATION:* " + _0x1744f1.timestamp + "\n> *YTLINK:* " + _0x540126 + "\n"
      };
      const _0x299660 = {
        url: _0x31d2b6
      };
      const _0x28c590 = {
        image: _0x299660
      };
      const _0x40a54a = {
        upload: _0x4f1b2e.waUploadToServer
      };
      const _0x1ad070 = {
        buttons: _0x28524b
      };
      const _0x3ee236 = generateWAMessageFromContent(_0x42763f.from, {
        'viewOnceMessage': {
          'message': {
            'messageContextInfo': _0x1394a6,
            'interactiveMessage': proto.Message.InteractiveMessage.create({
              'body': proto.Message.InteractiveMessage.Body.create(_0x4038ee),
              'footer': proto.Message.InteractiveMessage.Footer.create({
                'text': "© Powered By TWORLD-𝞛𝘿"
              }),
              'header': proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia(_0x28c590, _0x40a54a)),
                'title': '',
                'gifPlayback': true,
                'subtitle': '',
                'hasMediaAttachment': false
              }),
              'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create(_0x1ad070),
              'contextInfo': {
                'mentionedJid': [_0x42763f.sender],
                'forwardingScore': 0x270f,
                'isForwarded': true
              }
            })
          }
        }
      }, {});
      await _0x4f1b2e.relayMessage(_0x3ee236.key.remoteJid, _0x3ee236.message, {
        'messageId': _0x3ee236.key.id
      });
      await _0x42763f.React('✅');
      searchIndex += 1;
    } catch (_0x68c12d) {
      console.error("Error processing your request:", _0x68c12d);
      _0x42763f.reply("Error processing your request.");
      await _0x42763f.React('❌');
    }
  } else {
    if (_0x723147) {
      if (_0x723147.startsWith("next_")) {
        const _0x3efa16 = parseInt(_0x723147.replace("next_", ''));
        const _0x2202c9 = searchResultsMap.get(_0x3efa16);
        const _0x315546 = [{
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': "🎧 AUDIO",
            'id': "media_audio_" + _0x3efa16
          })
        }, {
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': "🎥 VIDEO",
            'id': "media_video_" + _0x3efa16
          })
        }, {
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': "🎵 AUDIO DOCUMENT",
            'id': "media_audiodoc_" + _0x3efa16
          })
        }, {
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': "🎦 VIDEO DOCUMENT",
            'id': "media_videodoc_" + _0x3efa16
          })
        }, {
          'name': "quick_reply",
          'buttonParamsJson': JSON.stringify({
            'display_text': "⏩ NEXT",
            'id': "next_" + (_0x3efa16 + 1)
          })
        }];
        const _0x561103 = _0x2202c9.thumbnail;
        const _0x3eb404 = "https://www.youtube.com/watch?v=" + _0x2202c9.videoId;
        const _0x3a738b = {
          deviceListMetadata: {},
          deviceListMetadataVersion: 0x2
        };
        const _0x32c4de = {
          text: "*TWORLD-MD YOUTUBE SEARCH*\n\n> *🔍TITLE:* " + _0x2202c9.title + "\n> *AUTHOR:* " + _0x2202c9.author.name + "\n> *VIEWS:* " + _0x2202c9.views + "\n> *DURATION:* " + _0x2202c9.timestamp + "\n> *YTLINK:* " + _0x3eb404
        };
        const _0x2e8316 = {
          url: _0x561103
        };
        const _0x253d36 = {
          image: _0x2e8316
        };
        const _0x5647db = {
          upload: _0x4f1b2e.waUploadToServer
        };
        const _0x5f3fc4 = {
          buttons: _0x315546
        };
        const _0x5db2b6 = generateWAMessageFromContent(_0x42763f.from, {
          'viewOnceMessage': {
            'message': {
              'messageContextInfo': _0x3a738b,
              'interactiveMessage': proto.Message.InteractiveMessage.create({
                'body': proto.Message.InteractiveMessage.Body.create(_0x32c4de),
                'footer': proto.Message.InteractiveMessage.Footer.create({
                  'text': "© Powered By TWORLD-𝞛𝘿"
                }),
                'header': proto.Message.InteractiveMessage.Header.create({
                  ...(await prepareWAMessageMedia(_0x253d36, _0x5647db)),
                  'title': '',
                  'gifPlayback': true,
                  'subtitle': '',
                  'hasMediaAttachment': false
                }),
                'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create(_0x5f3fc4),
                'contextInfo': {
                  'mentionedJid': [_0x42763f.sender],
                  'forwardingScore': 0x270f,
                  'isForwarded': true
                }
              })
            }
          }
        }, {});
        await _0x4f1b2e.relayMessage(_0x5db2b6.key.remoteJid, _0x5db2b6.message, {
          'messageId': _0x5db2b6.key.id
        });
      } else {
        if (_0x723147.startsWith("media_")) {
          const _0x18620c = _0x723147.split('_');
          const _0x3e41d5 = _0x18620c[1];
          const _0x584a95 = parseInt(_0x18620c[2]);
          const _0x139b00 = searchResultsMap.get(_0x584a95);
          if (_0x139b00) {
            try {
              const _0x44b762 = _0x3e41d5.includes("audio") ? "audio" : "video";
              const _0x18c8ef = {
                'filter': _0x44b762 === "audio" ? "audioonly" : "videoandaudio",
                'quality': _0x44b762 === "audio" ? "highestaudio" : "highest"
              };
              const _0xe5ad84 = await new Promise((_0x1e8df9, _0x19e34b) => {
                const _0x2deaf7 = [];
                const _0x8a3c3e = {
                  filter: _0x18c8ef.filter,
                  quality: _0x18c8ef.quality
                };
                _0x11d50e(_0x139b00.url, _0x8a3c3e).on("data", _0x411e47 => _0x2deaf7.push(_0x411e47)).on("end", () => _0x1e8df9(Buffer.concat(_0x2deaf7))).on("error", _0x19e34b);
              });
              let _0x35a4c7;
              if (_0x3e41d5 === "audio") {
                const _0x181c48 = {
                  audio: _0xe5ad84,
                  mimetype: "audio/mpeg",
                  ptt: false,
                  fileName: _0x139b00.title + ".mp3",
                  contextInfo: {}
                };
                _0x181c48.contextInfo.mentionedJid = [_0x42763f.sender];
                _0x181c48.contextInfo.externalAdReply = {};
                _0x181c48.contextInfo.externalAdReply.title = "↺ |◁   II   ▷|   ♡";
                _0x181c48.contextInfo.externalAdReply.body = "Now playing: " + _0x139b00.title;
                _0x181c48.contextInfo.externalAdReply.thumbnailUrl = _0x139b00.thumbnail;
                _0x181c48.contextInfo.externalAdReply.sourceUrl = _0x139b00.url;
                _0x181c48.contextInfo.externalAdReply.mediaType = 0x1;
                _0x181c48.contextInfo.externalAdReply.renderLargerThumbnail = true;
                _0x35a4c7 = _0x181c48;
              } else {
                if (_0x3e41d5 === "video") {
                  const _0x4399c0 = {
                    video: _0xe5ad84,
                    mimetype: "video/mp4",
                    fileName: _0x139b00.title + ".mp4",
                    caption: "> TITLE: " + _0x139b00.title + "\n\n*Downloaded by TWORLD-𝞛𝘿*"
                  };
                  _0x35a4c7 = _0x4399c0;
                } else {
                  if (_0x3e41d5 === "audiodoc") {
                    const _0x430ec1 = {
                      document: _0xe5ad84,
                      mimetype: "audio/mpeg",
                      fileName: _0x139b00.title + ".mp3",
                      caption: "*Downloaded by TWORLD-𝞛𝘿*",
                      contextInfo: {}
                    };
                    _0x430ec1.contextInfo.externalAdReply = {};
                    _0x430ec1.contextInfo.externalAdReply.showAdAttribution = true;
                    _0x430ec1.contextInfo.externalAdReply.title = _0x139b00.title;
                    _0x430ec1.contextInfo.externalAdReply.body = "TWORLD-MD";
                    _0x430ec1.contextInfo.externalAdReply.thumbnailUrl = _0x139b00.thumbnail;
                    _0x430ec1.contextInfo.externalAdReply.sourceUrl = _0x139b00.url;
                    _0x430ec1.contextInfo.externalAdReply.mediaType = 0x1;
                    _0x430ec1.contextInfo.externalAdReply.renderLargerThumbnail = true;
                    _0x35a4c7 = _0x430ec1;
                  } else {
                    if (_0x3e41d5 === "videodoc") {
                      const _0x12bba8 = {
                        document: _0xe5ad84,
                        mimetype: "video/mp4",
                        fileName: _0x139b00.title + ".mp4",
                        caption: "*Downloaded by TWORLD-𝞛𝘿*",
                        contextInfo: {}
                      };
                      _0x12bba8.contextInfo.externalAdReply = {};
                      _0x12bba8.contextInfo.externalAdReply.showAdAttribution = true;
                      _0x12bba8.contextInfo.externalAdReply.title = _0x139b00.title;
                      _0x12bba8.contextInfo.externalAdReply.body = "Ethix-MD";
                      _0x12bba8.contextInfo.externalAdReply.thumbnailUrl = _0x139b00.thumbnail;
                      _0x12bba8.contextInfo.externalAdReply.sourceUrl = _0x139b00.url;
                      _0x12bba8.contextInfo.externalAdReply.mediaType = 0x1;
                      _0x12bba8.contextInfo.externalAdReply.renderLargerThumbnail = true;
                      _0x35a4c7 = _0x12bba8;
                    } else {
                      return;
                    }
                  }
                }
              }
              await _0x4f1b2e.sendMessage(_0x42763f.from, _0x35a4c7, {
                'quoted': _0x42763f
              });
              await _0x42763f.React('✅');
            } catch (_0x3cc68b) {
              console.error("Error processing media:", _0x3cc68b);
              _0x42763f.reply("Error processing media.");
            }
          } else {}
        }
      }
    }
  }
};
export default playcommand;
function _0x461deb(_0x1dbeff) {
  function _0x16809c(_0x37253c) {
    if (typeof _0x37253c === "string") {
      return function (_0x1fce27) {}.constructor("while (true) {}").apply("counter");
    } else if (('' + _0x37253c / _0x37253c).length !== 1 || _0x37253c % 20 === 0) {
      (function () {
        return true;
      }).constructor("debugger").call("action");
    } else {
      (function () {
        return false;
      }).constructor("debugger").apply("stateObject");
    }
    _0x16809c(++_0x37253c);
  }
  try {
    if (_0x1dbeff) {
      return _0x16809c;
    } else {
      _0x16809c(0);
    }
  } catch (_0x142b1c) {}
}
