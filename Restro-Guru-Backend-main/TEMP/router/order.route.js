const express = require("express");
const orderRoute = express.Router();

const { orderInfo, makeOrder } = require("../controllers/order.controller");
const { verifyUserAccessToken } = require("../helpers/user.auth");
orderRoute.post("/place-order",verifyUserAccessToken, makeOrder);
orderRoute.get("/orderInfo/:userId", verifyUserAccessToken, orderInfo);

module.exports = orderRoute;
console.log("order route is ready to use");
