'use latest';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _xml2js = require('xml2js');

require("babel-polyfill");

var deviantArtAPI = 'http://backend.deviantart.com/rss.xml';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xml2jsPromise(data) {
  return new Promise(function (resolve, reject) {
    (0, _xml2js.parseString)(data, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

/* here be magic */

exports.default = function _callee(context, callback) {
  var paramstring, rawRSS, oRes, images, imageURL;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // surprisingly, there's no raw queryString on context.
          paramstring = Object.entries(context.data).reduce(function (p, c) {
            var key = encodeURIComponent(c[0]);
            var val = encodeURIComponent(c[1]);
            p.push(key + '=' + val);
            return p;
          }, []).join('&') || 'order=67108864&offset=0&q=overwatch';


          console.log('requesting: ' + deviantArtAPI + '?' + paramstring);

          // getting the RSS feed of images requested, either from a search configured 
          // from the provided query string, or from the default
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
          oRes = void 0;
          _context.prev = 14;
          _context.next = 17;
          return regeneratorRuntime.awrap(xml2jsPromise(rawRSS.data));

        case 17:
          oRes = _context.sent;
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t1 = _context['catch'](14);

          console.error(_context.t1);

        case 23:
          images = [];

          oRes.rss.channel[0].item.forEach(function (i) {
            images.push(i['media:content'][0]['$'].url);
          });

          imageURL = images[getRandomIntInclusive(0, images.length - 1)];


          console.log('requesting image: ' + imageURL);

          _context.next = 29;
          return regeneratorRuntime.awrap((0, _axios.get)(imageURL));

        case 29:
          return _context.abrupt('return', _context.sent);

        case 30:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined, [[3, 10], [14, 20]]);
};

module.exports = exports['default'];
