// Load mongoose

const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

// connection string
const db_url = process.env.MONGODB_URL;

const con = mongoose
  .connect(`${db_url}`)
  .then(() => {
    console.log("connected to databse");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = con;
console.log("database conection string is ready to use");
