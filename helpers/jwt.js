var { expressjwt: expressJwt } = require("express-jwt");
const api = process.env.API_URL;

function authJwt() {
  const secret = process.env.JWT_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      //regular expression
      { url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTIONS"] },
      //.* indicates the other ui link after product
      { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] }, //methods indicates the http method to allow
      { url: /\/api\/v1\/user\/.*/, methods: ["GET"] },
      `${api}/user/login`,
      `${api}/user/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
