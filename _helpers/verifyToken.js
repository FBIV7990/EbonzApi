const config = require("config.json");
const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
module.exports = verifyToken;

async function verifyToken(req) {
  return new Promise((resolve, reject) => {
    token = req.headers.authorization.substr(7);

    jwt.verify(token, config.secret, (err, authData) => {
      if (!err) {
        if (authData.uid == req.body.id) resolve(true);
        else reject("Invalid Token");
      } else {
        reject(err);
      }
    });
  });
}
