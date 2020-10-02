require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const jwtadmin = require("_helpers/jwt-admin");
const path = require("path");
const errorHandler = require("_helpers/error-handler");
var https = require("https");
var fs = require("fs");
var sockets = require("./controllers/chat.controller");
const WebSocket = require("ws");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Public folders
app.use("/profilePhotos", express.static(__dirname + "/profilePhotos"));
app.use("/adPhotos", express.static(__dirname + "/adPhotos"));
app.use("/images", express.static(__dirname + "/images"));

// api routes
app.use("/admin", require("./admin/controllers/main.controller"));
app.use("/", require("./controllers/main.controller"));

// global error handler
app.use(errorHandler);

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4001;

var options = {
  key: fs.readFileSync("certificates/ebonz.key", "utf8"),
  cert: fs.readFileSync("certificates/ssl-bundle.crt", "utf8"),
};

const server = https.createServer(options, app);

// const wss = new WebSocket.Server({ server });

// wss.on('connection', function connection(ws) {
//   console.log('connected')
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   ws.send('something');
// });
sockets.startSocketServerWSS(server);
server.listen(port);
console.log("Server is listening on port :" + port);

//https.createServer(options, app).listen(port, function(){
//sockets.startSocketServerWSS(https);
//   console.log('listening on *:'+port);
// });
// const express = require('express');
// const app = express();
// const http = require('http');
// const httpServer = http.Server(app);
// const io = require('socket.io')(httpServer);
// const SocketIOFile = require('socket.io-file');

// app.get('/', (req, res, next) => {
//     return res.sendFile(__dirname + '/index.html');
// });

// app.get('/socket.io.js', (req, res, next) => {
//     return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
// });

// app.get('/socket.io-file-client.js', (req, res, next) => {
//     return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
// });

// io.on('connection', (socket) => {
//     console.log('Socket connected.');

//     var uploader = new SocketIOFile(socket, {
//         // uploadDir: {			// multiple directories
//         // 	music: 'data/music',
//         // 	document: 'data/document'
//         // },
//         uploadDir: 'data',							// simple directory
//         accepts: ['audio/mpeg', 'audio/mp3','image/png'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
//         maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
//         chunkSize: 10240,							// default is 10240(1KB)
//         transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
//         overwrite: true 							// overwrite file if exists, default is true.
//     });
//     uploader.on('start', (fileInfo) => {
//         console.log('Start uploading');
//         console.log(fileInfo);
//     });
//     uploader.on('stream', (fileInfo) => {
//         console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
//     });
//     uploader.on('complete', (fileInfo) => {
//         console.log('Upload Complete.');
//         console.log(fileInfo);
//     });
//     uploader.on('error', (err) => {
//         console.log('Error!', err);
//     });
//     uploader.on('abort', (fileInfo) => {
//         console.log('Aborted: ', fileInfo);
//     });
// });

// const port=4002;
// httpServer.listen(port, () => {
//     console.log('Server listening on port '+port);
// });
