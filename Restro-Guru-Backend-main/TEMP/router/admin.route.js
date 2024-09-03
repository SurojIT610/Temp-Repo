const exp = require("express");
const {
  updateFood,
  deleteFood,
  addNewFood,
} = require("../controllers/food.controller");

const admin = exp.Router();

const { verifyAccessToken, verifyRefreshToken } = require("../helpers/auth");
const { deleteUser } = require("../controllers/user.controller");
const {
  register,
  adminLogin,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/admin.controller");

//for altering food
admin.post("/addNewFoodItems", verifyAccessToken, addNewFood);

admin.delete("/deleteFoodById/:id", verifyAccessToken, deleteFood);

admin.all("/updateFoodItems/:id", verifyAccessToken, updateFood);
//for feteching user detail
admin.get("/adminGetuserInfo", verifyAccessToken, getAllUsers);
//gett all orders detail
admin.get("/adminGetOrderInfo", verifyAccessToken, getAllOrders);
//for updating order status
admin.all('/UpdateOrderStatus/:id',verifyAccessToken,updateOrderStatus)
//for altering user
admin.delete("/deleteUser/:id", verifyAccessToken, deleteUser);

//for admin login sinup
admin.post("/adminSinup", register);
admin.post("/adminLogin", adminLogin);

module.exports = admin;
console.log("admin routes are exported");
