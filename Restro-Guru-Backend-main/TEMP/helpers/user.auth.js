const JWT = require("jsonwebtoken");
const fs = require("fs");

const verifyUserAccessToken = (req, res, next) => {
  //   try {
  //     const access_key = fs.readFileSync(
  //       __dirname + "/../config/access_token_key.text",
  //       "utf8"
  //     );
  //     if (access_key) {
  //       const token = req.headers["Authorization"]?.split(" ")[1]; // Extract token from Bearer scheme
  //       console.log("Access Token:", token);
  //       if (!token) return res.status(401).json({ message: "No token provided" });

  //       JWT.verify(token, access_key, (err, decoded) => {
  //         if (err)
  //           return res
  //             .status(403)
  //             .json({ message: "Failed to authenticate token" });
  //         req.decode = decoded; // Attach decoded info to request
  //         next();
  //       });
  //     } else {
  //       return res.status(500).send("Invalid access key");
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // };
  try {
    let access_key = fs.readFileSync(
      __dirname + "/../config/access_token_key.text"
    );
    if (access_key) {
      var Decode = JWT.verify(req.headers["_accesstoken"], access_key);
      req.decode = Decode;
      next();
    } else {
      return res.send("invalid acces key");
    }
  } catch (error) {
    return res.send(error);
  }
};
const verifyUserRefreshToken = (req, res, next) => {
  //   try {
  //     const refresh_key = fs.readFileSync(
  //       __dirname + "/../config/refresh_token_key.text",
  //       "utf8"
  //     );
  //     if (refresh_key) {
  //       const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Bearer scheme
  //       if (!token) return res.status(401).json({ message: "No token provided" });

  //       JWT.verify(token, refresh_key, (err, decoded) => {
  //         if (err)
  //           return res
  //             .status(403)
  //             .json({ message: "Failed to authenticate token" });
  //         req.decode = decoded; // Attach decoded info to request
  //         next();
  //       });
  //     } else {
  //       return res.status(500).send("Invalid refresh key");
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // };
  try {
    let refresh_key = fs.readFileSync(
      __dirname + "/../config/refresh_token_key.text"
    );

    if (refresh_key) {
      var Decode = JWT.verify(req.headers["_refreshtoken"], refresh_key);
      req.decode = Decode;
      next();
    } else {
      return res.send("invalid refresh key");
    }
  } catch (error) {
    return res.send(error);
  }
};
module.exports = { verifyUserAccessToken, verifyUserRefreshToken };
console.log("Auth functions ready to use");
