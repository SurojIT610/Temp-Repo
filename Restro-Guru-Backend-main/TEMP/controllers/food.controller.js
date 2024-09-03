const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
// LOADE MODEL
const foodModel = require("../model/food_model");

//LOADE UPLODE OBJ
const uplodeObj = require("../file_uplode/file_uploade_config");

let getAll = (req, res) => {
  let foodInfo = foodModel.find().exec();
  foodInfo
    .then((info) => {
      res.status(200).json(info);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// GET FOOD ITEM BY BY ID
let getById = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(500).json({ error: "invalid ID" });
  }
  let info = foodModel.findById({ _id: req.params.id });
  info
    .then((result) => {
      return res.status(200).json({ info: result });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// FOOD price by LIMIT TASK
let getPriceByLimit = (req, res) => {
  let start = Number(req.params.st);
  let end = Number(req.params.en);
  if (end < start) {
    return res
      .status(401)
      .json({ message: "start limit is must be smaller than end limit" });
  }
  let info = foodModel.find({
    $and: [
      {
        price: { $gte: start },
      },
      {
        price: { $lte: end },
      },
    ],
  });
  info
    .then((result) => {
      res.status(200).json({ info: result });
    })
    .catch((err) => {
      res.status(500).json({ info: err });
    });
};

// FIND FOOD ITEM BY LIMIT WHICH IS NOT IN RANGE
let notinLimit = (req, res) => {
  var start = Number(req.params.st);
  var end = Number(req.params.en);
  console.log(start, end);
  if (end < start) {
    return res
      .status(401)
      .json({ message: "start limit is must be smaller than end limit" });
  }
  let info = foodModel.find({
    price: { $not: { $gte: start, $lte: end } },
  });
  info
    .then((result) => {
      res.status(200).json({ info: result });
    })
    .catch((err) => {
      res.status(500).json({ info: err });
    });
};

// FOR ADDING NEW FOOD ITEMS

let addNewFood = (req, res) => {
  let uplode = uplodeObj.single("image");
  uplode(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //for  multer error occered when uploding
      return res.status(500).json({ error: err });
    } else if (err) {
      //an unknown erroorrr occured during uploding
      return res
        .status(500)
        .json({ Error: err, msg: "only jpg||png||jpeg||gif are alloweed...!" });
    }
    /*** ADD NEW  FOOD ITEM  ****/
    /***with static image url***/
    let image_url = process.env.BASE_URL;
    let newFoodItem = new foodModel({
      food: req.body.food,
      desc: req.body.desc,
      price: req.body.price,
      type: req.body.type,
      image: `${image_url}/foods/${req.file.filename}`,
    });
    let info = newFoodItem.save();
    info
      .then((result) => {
        return res.status(200).json({ newItem: result });
      })
      .catch((error) => {
        return res.status(500).json({ err: error });
      });
  });
};

// FOR DELETE FOOD ITEMS
let deleteFood = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.send("invalid food id");
  }
  let Foodinfo = foodModel.findByIdAndDelete({ _id: req.params.id });
  Foodinfo.then((result) => {
    if (!result) {
      return res
        .status(500)
        .json({ message: "item not found or deleted from DB" });
    }
    return res.status(200).json({ message: "item deleted sussesfully....!" });
  }).catch((error) => {
    return res.status(500).json({ err: error });
  });
};

//FOR UPDATEING FOODS

let updateFood = (req, res) => {
  if (req.method === "PUT" || req.method === "PATCH") {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "invalid id" });
    }
    let uplode = uplodeObj.single("image");
    uplode(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occured when uploding
        return res.status(500).json({ error: err });
      } else if (err) {
        // An unknown Error occured
        return res.status(500).json({ error: err.message });
      }
      //Find the current food details in DB
      foodModel.findById(req.params.id).then((result) => {
        if (!result) {
          return res.status(404).json("food item not found");
        }
        // Determine updated fields
        let updateFood = req.body.food ? req.body.food : result.food;
        let updateDesc = req.body.desc ? req.body.desc : result.desc;
        let updatePrice = req.body.price ? req.body.price : result.price;
        let updateType = req.body.type ? req.body.type : result.type;
        let image_url = process.env.BASE_URL;
        let updateFile = req.file
          ? `${image_url}/foods/${req.file.filename}`
          : result.image;
        let updateInfo = foodModel.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              food: updateFood,
              desc: updateDesc,
              price: updatePrice,
              type: updateType,
              image: updateFile,
            },
          },
          { new: true }
        );
        updateInfo
          .then((updatedResult) => {
            if (!updatedResult) {
              return res.status(500).json({ message: "something went wrong" });
            }
            return res.status(200).json({
              message: "item updated susscesfull",
              info: updatedResult,
            });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      });
    });
  } else {
    return res.status(405).json(`${req.method} does not support...!`);
  }
};

module.exports = {
  getAll,
  getById,
  getPriceByLimit,
  notinLimit,
  addNewFood,
  deleteFood,
  updateFood,
};
console.log("food controller is ready to use");
