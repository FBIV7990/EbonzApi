const expressJwt = require("express-jwt");
const config = require("config.json");
const userService = require("../services/user.service");
const jwtoken = require("jsonwebtoken");
module.exports = jwt;

function jwt() {
  const secret = config.secret;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/users/authenticate",
      "/users/register",
      "/users/verifyOTP",
      "/users/setPassword",
      "/users/forgetPassword",
      "/users/resendOTP",
      "/categories",
      "/posts/"    ,
      "/posts/getByCategory/"  ,
      "/posts/getBySubCategory/"  ,
      "/suggestions",
      "/locations",
      "/slider",
      "/career/add",
      "/feedbacks/add",
      "/contactUs/add",
      "/enquiry/add"
     
    ]
  });
}

async function isRevoked(req, payload, done) {

  console.log('user jwt called')
  const user = await userService.getById(payload.uid);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}
