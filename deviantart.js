'use latest'
'use strict'

//require("babel-polyfill");

import {get} from 'axios'
import {parseString} from 'xml2js'

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

/* here be magic */
export default async (context, callback) => {
  // surprisingly, there's no raw queryString on context.
  const paramstring = Object.entries(context.data)
    .reduce((p,c) => { 
      const key = encodeURIComponent(c[0])
      const val = encodeURIComponent(c[1])
      p.push(key + '=' + val)
      return p 
    }, []).join('&') || 'order=67108864&offset=0&q=overwatch'

console.log('requesting: ' + deviantArtAPI + '?' + paramstring)

    // getting the RSS feed of images requested, either from a search configured 
    // from the provided query string, or from the default
    let rawRSS
    try {
      rawRSS = await get(deviantArtAPI + '?' + paramstring)
        .catch(e => {throw e})
      console.log('...done')
    } catch (e) {
      console.error(e)
    }

    let oRes
    try {
      oRes = await xml2jsPromise(rawRSS.data)
    } catch(e) {
      console.error(e)
    }

    let images = []
    oRes.rss.channel[0].item
      .forEach(i => {
        images.push(i['media:content'][0]['$'].url)
      })
    
    const imageURL = images[getRandomIntInclusive(0, images.length - 1)]

console.log('requesting image: ' + imageURL)

     return await get(imageURL)
}