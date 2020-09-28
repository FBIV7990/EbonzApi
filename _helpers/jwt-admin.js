const expressJwt = require("express-jwt");
const config = require("config.json");
const adminService = require("../admin/services/admin.service");
const jwtoken = require("jsonwebtoken");
module.exports = jwtadmin;

function jwtadmin() {
  const secret = config.secret;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
       // public routes that don't require authentication
       "/admin/authenticate",
       "/admin/register",
       "/admin/verifyOTP",
       "/admin/setPassword",
       "/admin/slider"
    ]
  });
}

async function isRevoked(req, payload, done) {

 
  const user = await adminService.getById(payload.uid);
 
  // revoke token if user no longer exists
  if (!user) {
    if(user.deleted)
   return done();
    else
    return done(null, true);
  }
  done();
}
