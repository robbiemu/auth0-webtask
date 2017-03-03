'use latest';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _xml2js = require('xml2js');

var _object = require('object.entries');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// node 4.4.7 shim

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

exports.default = function (context, req, res) {
  var paramstring, rawRSS, oRes, images, imageURL, img;
  return Promise.resolve().then(function () {
    // surprisingly, there's no raw queryString on context.
    paramstring = (0, _object2.default)(context.data).reduce(function (p, c) {
      var key = encodeURIComponent(c[0]);
      var val = encodeURIComponent(c[1]);
      p.push(key + '=' + val);
      return p;
    }, []).join('&') || 'order=67108864&offset=0&q=overwatch';


    console.log('requesting: ' + deviantArtAPI + '?' + paramstring);

    // get the rss of images to select from
    rawRSS = void 0;
    oRes = void 0;
    return Promise.resolve().then(function () {
      return (0, _axios.get)(deviantArtAPI + '?' + paramstring).catch(function (e) {
        throw e;
      });
    }).then(function (_resp) {
      rawRSS = _resp;
      console.log('...done');
      return xml2jsPromise(rawRSS.data);
    }).then(function (_resp) {
      oRes = _resp;
    }).catch(function (e) {
      console.error(e);
    });
  }).then(function () {

    // pick at random
    images = [];

    oRes.rss.channel[0].item.forEach(function (i) {
      images.push(i['media:content'][0]['$'].url);
    });

    imageURL = images[getRandomIntInclusive(0, images.length - 1)];


    console.log('requesting image: ' + imageURL);

    // fetch and serve
    img = void 0;
    return Promise.resolve().then(function () {
      return (0, _axios.get)(imageURL, { responseType: 'arraybuffer' });
    }).then(function (_resp) {
      img = _resp.data;
      console.log('...done [2]');
    }).catch(function (e) {
      console.error(e);
    });
  }).then(function () {

    res.writeHead(200, { 'Content-Type': 'image/jpeg ' });
    res.end(img, 'binary');
  });
};

module.exports = exports['default'];
