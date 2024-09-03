// loade mongoose
const mongoose = require("mongoose");

// CREATE SCEMA OF FOOD MODEL
const FoodSchema = mongoose.Schema(
  {
    food: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);


// VIRTUAL NAME OF SCHEMA   |     ACTUALLL DB COLLECTION
const foodModel = mongoose.model("foodModel", FoodSchema, "foods");

module.exports = foodModel;
console.log("food model ready to use...!");
