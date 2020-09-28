require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const jwtadmin = require("_helpers/jwt-admin");
const path = require("path");
const errorHandler = require("_helpers/error-handler");
var https = require('https');
var fs = require('fs');
var sockets=require("./controllers/chat.controller")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Public folders
app.use("/profilePhotos", express.static(__dirname + "/profilePhotos"));
app.use("/adPhotos", express.static(__dirname + "/adPhotos"));
app.use("/images", express.static(__dirname + "/images"));


// api routes
app.use("/admin",require("./admin/controllers/main.controller"))
app.use("/",require("./controllers/main.controller"))


// global error handler
app.use(errorHandler);

// sockets.startSocketServer(https);
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;


var options = {
  key: fs.readFileSync('certificates/ebonz.key','utf8'),
  cert: fs.readFileSync('certificates/ssl-bundle.crt','utf8')
};

const server=https.createServer(options,app);
sockets.startSocketServerWSS(server);
server.listen(port);
console.log('Server is listening on port :'+port);

