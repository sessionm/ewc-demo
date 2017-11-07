/*eslint-disable */

// create a cert.pem file:
// > openssl req -new -x509 -keyout cert.pem -out cert.pem -days 365 -nodes

// use that cert.pem file to generate a key.pem file:
// > openssl rsa -in cert.pem -out key.pem

// run the server with `sudo node server.js` or `npm run server`
const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const port = 443

app.use(express.static('./'))

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
})
