'use latest'
'use strict'

import {get} from 'axios'
import {parseString} from 'xml2js'

import entries from 'object.entries' // node 4.4.7 shim

const deviantArtAPI = 'http://backend.deviantart.com/rss.xml'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xml2jsPromise(data) {
  return new Promise((resolve, reject) => {
    parseString(data, 
      (err, result) => err? reject(err) : resolve(result))
  })
}

export default async (context, req, res) => {
  // surprisingly, there's no raw queryString on context.
  const paramstring = entries(context.data)
    .reduce((p,c) => { 
      const key = encodeURIComponent(c[0])
      const val = encodeURIComponent(c[1])
      p.push(key + '=' + val)
      return p 
    }, []).join('&') || 'order=67108864&offset=0&q=overwatch'

console.log('requesting: ' + deviantArtAPI + '?' + paramstring)

  // get the rss of images to select from
  let rawRSS, oRes
  try {
    rawRSS = await get(deviantArtAPI + '?' + paramstring)
      .catch(e => {throw e})
    console.log('...done')
    oRes = await xml2jsPromise(rawRSS.data)
  } catch (e) {
    console.error(e)
  }

  // pick at random
  let images = []
  oRes.rss.channel[0].item
    .forEach(i => {
      images.push(i['media:content'][0]['$'].url)
    })
    
  const imageURL = images[getRandomIntInclusive(0, images.length - 1)]

console.log('requesting image: ' + imageURL)

  // fetch and serve
  let img
  try {
    img = (await get(imageURL, {responseType: 'arraybuffer'})).data
    console.log('...done [2]')
  } catch (e) {
    console.error(e)
  } 

  res.writeHead(200, { 'Content-Type': 'image/jpeg ' });
  res.end(img, 'binary')
}