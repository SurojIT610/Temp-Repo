const JWT = require("jsonwebtoken");
const fs = require("fs");

const createAccess_token = async (email, id) => {
  const access_key = fs.readFileSync(__dirname + '/../config/access_token_key.text');
  if (access_key) {
    return JWT.sign({ _id: id, email: email }, access_key, { expiresIn: "10m" });
  }
};

const createRefresh_token = async (email, id) => {
  const refresh_key = fs.readFileSync(__dirname + '/../config/refresh_token_key.text');
  if (refresh_key) {
    return JWT.sign({ _id: id, email: email }, refresh_key, { expiresIn: "1h" });
  }
};

module.exports = { createAccess_token, createRefresh_token };
console.log("JWT Helpers ready to use");
