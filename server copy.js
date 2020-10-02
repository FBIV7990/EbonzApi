require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const jwtadmin = require("_helpers/jwt-admin");
const path = require("path");
const errorHandler = require("_helpers/error-handler");
var http = require("http").createServer(app);
//var https = require('https');
//var fs = require('fs');
var sockets = require("./controllers/chat.controller");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Public folders
app.use("/profilePhotos", express.static(__dirname + "/profilePhotos"));
app.use("/adPhotos", express.static(__dirname + "/adPhotos"));
app.use("/images", express.static(__dirname + "/images"));

// use JWT auth to secure the api
//app.use(jwt());

// api routes
app.use("/admin", require("./admin/controllers/main.controller"));
app.use("/", require("./controllers/main.controller"));

// global error handler
app.use(errorHandler);

sockets.startSocketServer(http);
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4001;
http.listen(port, function () {
  console.log("listening on *:" + port);
});

// var options = {
//   key: fs.readFileSync('certificates/key.pem','utf8'),
//   cert: fs.readFileSync('certificates/server.crt','utf8')
// };

// https.createServer(options, app).listen(port, function(){
//   console.log('listening on *:'+port);
// });
