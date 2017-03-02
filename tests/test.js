const dev = require('../dist/deviantart')

try {
  console.log(dev({data:{}}))
} catch (e) {
  console.error(e)
}
