
const JWT = require("jsonwebtoken");
const fs = require("fs");
const verifyAccessToken = (req, res, next) => {
  try {
    let access_key = fs.readFileSync(
      __dirname + "/../config/access_token_key.text"
    );
    if (access_key) {
      var Decode = JWT.verify(req.headers["accesstoken"], access_key);
      next();
    } else {
      return res.send("invalid acces key");
    }
  } catch (error) {
    return res.send(error);
  }
};

const verifyRefreshToken = (req, res, next) => {
  try {
    let refresh_key = fs.readFileSync(
      __dirname + "/../config/refresh_token_key.text"
    );

    if (refresh_key) {
      var Decode = JWT.verify(req.headers["refreshtoken"], refresh_key);
      req.decode = Decode;
      next();
    } else {
      return res.send("invalid refresh key");
    }
  } catch (error) {
    return res.send(error);
  }
};
module.exports = { verifyAccessToken, verifyRefreshToken };
console.log("auth function rady to use");

