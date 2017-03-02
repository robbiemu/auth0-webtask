'use latest';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _xmlJs = require('xml-js');

require("babel-polyfill");

var deviantArtAPI = 'http://backend.deviantart.com/rss.xml';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getImageRSS(url) {
  return new Promise(function (resolve, reject) {
    // request(url, function(error, response, body) {
    //   if (error) return reject(error);
    //   resolve(body);
    //  });
  });
}

exports.default = function _callee(context, callback) {
  var paramstring, rawRSS, oRes, images, imageURL;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          paramstring = Object.entries(context.data).reduce(function (p, c) {
            var key = encodeURIComponent(c[0]);
            var val = encodeURIComponent(c[1]);
            p.push(key + '=' + val);
            return p;
          }, []).join('&') || 'order=67108864&offset=0&q=overwatch';


          console.log('requesting: ' + deviantArtAPI + '?' + paramstring);

          rawRSS = void 0;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _axios.get)(deviantArtAPI + '?' + paramstring).catch(function (e) {
            throw e;
          }));

        case 6:
          rawRSS = _context.sent;

          console.log('...done');
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context['catch'](3);

          console.error(_context.t0);

        case 13:
          oRes = (0, _xmlJs.xml2js)(rawRSS.data, { compact: true });
          images = Object.entries(oRes.rss.channel.item).map(function (e) {
            return e[1]['media:content']['_attributes'].url;
          });
          imageURL = images[getRandomIntInclusive(0, images.length - 1)];


          console.log('requesting image: ' + imageURL);

          _context.next = 19;
          return regeneratorRuntime.awrap((0, _axios.get)(imageURL));

        case 19:
          return _context.abrupt('return', _context.sent);

        case 20:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined, [[3, 10]]);
};

module.exports = exports['default'];
