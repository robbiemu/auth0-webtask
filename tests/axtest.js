import {get} from "axios"

const imgurl = 'http://img06.deviantart.net/ecea/i/2016/271/b/b/overwatch_by_maorenc-daj677t.jpg';

(async function() {
  const ret = await get(imgurl)
  console.log(ret)
})()