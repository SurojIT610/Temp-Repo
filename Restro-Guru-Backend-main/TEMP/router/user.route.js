const express = require("express");
const UserRoute = express.Router();

const {
  register,
  login,
  new_refresh_token,
  new_access_token,
  userInfo,
  // deleteUser,
  userInfoById,
  editUser,
} = require("../controllers/user.controller");
const {
  verifyUserAccessToken,
  verifyUserRefreshToken,
} = require("../helpers/user.auth");

UserRoute.post("/register", register);
UserRoute.post("/login", login);
UserRoute.get("/userInfo", verifyUserAccessToken, userInfo);
UserRoute.get("/user/:id", verifyUserAccessToken, userInfoById);
UserRoute.patch("/userUpdate", verifyUserAccessToken, editUser);
// UserRoute.delete("/deleteUser/:id", deleteUser);
// UserRoute.post("/new_refresh-token", verifyRefreshToken, new_refresh_token);
// UserRoute.post("/new_access-token", verifyRefreshToken, new_access_token);

module.exports = UserRoute;
console.log("User routes ready to use");
