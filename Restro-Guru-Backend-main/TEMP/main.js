// load express
const express = require("express");
const app = express();
const cors = require("cors");
const con = require("./db/db_conection");

const FoodRoute = require("./router/food.route");
const UserRoute = require("./router/user.route");
const orderRoute = require("./router/order.route");
const admin = require("./router/admin.route");

// middelwaresss..!!
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// server static resorce share
app.use(express.static(__dirname + "/public/uploads"));

const port = 3000;

// API END POINT
app.use("/api/v1", FoodRoute);
app.use("/api/v1", UserRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", admin);

// Basic landing page
app.get("/", (req, res) => {
  res.send(`<h4 align="center" style="color:red;">Welcome to restro</h4>`);
});

// port binding
app.listen(port, () => {
  console.log(`server hast started at local host:${port}`);
});
