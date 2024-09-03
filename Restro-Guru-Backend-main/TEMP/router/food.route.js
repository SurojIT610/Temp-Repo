// ALL FOOD RELATED API END POINTS
const express = require("express");
const FoodRoute = express.Router();


const {
  getAll,
  getById,
  getPriceByLimit,
  notinLimit,
} = require("../controllers/food.controller");
const { verifyAccessToken } = require("../helpers/auth");

// FoodRoute.get("/getAllfoods",verifyAccessToken, getAll);
FoodRoute.get("/getAllfoods", getAll);


FoodRoute.get("/getFoodByid/:id", getById);

// FoodRoute.get("/getAllfoodsLimit/:st/:en", getPriceByLimit);

// FoodRoute.get("/getAllFoodsNotinRange/:st/:en", notinLimit);

module.exports = FoodRoute;
console.log("Food route is ready to use");
