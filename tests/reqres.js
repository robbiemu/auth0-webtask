'use latest'

export default (cx, req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/json '});
  res.end({a:1})
}