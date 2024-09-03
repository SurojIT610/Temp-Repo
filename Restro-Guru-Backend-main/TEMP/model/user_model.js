const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = mongoose.Schema({
  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    set: (v) => bcryptjs.hashSync(v, bcryptjs.genSaltSync(10)),
  },
}, { versionKey: false });

UserSchema.methods.validateFunction = (pass, dbPass) => {
  return bcryptjs.compareSync(pass, dbPass);
};

const UserModel = mongoose.model("UserModel", UserSchema, "users");
module.exports = UserModel;
console.log("User model ready to use");
