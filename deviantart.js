'use latest'
'use strict'

require("babel-polyfill");

import {get} from 'axios'
import {xml2js} from 'xml-js'

const deviantArtAPI = 'http://backend.deviantart.com/rss.xml'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async (context, callback) => {
  const paramstring = Object.entries(context.data)
    .reduce((p,c) => { 
      const key = encodeURIComponent(c[0])
      const val = encodeURIComponent(c[1])
      p.push(key + '=' + val)
      return p 
    }, []).join('&') || 'order=67108864&offset=0&q=overwatch'

console.log('requesting: ' + deviantArtAPI + '?' + paramstring)

    let rawRSS
    try {
      rawRSS = await get(deviantArtAPI + '?' + paramstring)
        .catch(e => {throw e})
      console.log('...done')
    } catch (e) {
      console.error(e)
    }

    const oRes = xml2js(rawRSS.data, {compact: true})

    const images = Object.entries(oRes.rss.channel.item)
      .map(e => e[1]['media:content']['_attributes'].url)
    
    const imageURL = images[getRandomIntInclusive(0, images.length - 1)]

console.log('requesting image: ' + imageURL)

     return await get(imageURL)
}