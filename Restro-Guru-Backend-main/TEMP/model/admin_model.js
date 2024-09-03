const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const AdminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      set: (v) => bcryptjs.hashSync(v, bcryptjs.genSaltSync(10)),
    },
  },
  { versionKey: false }
);
AdminSchema.methods.validateFunction = (pass, dbPass) => {
  return bcryptjs.compareSync(pass, dbPass);
};

const AdminModel = mongoose.model("AdminModel", AdminSchema, "admins");

module.exports = AdminModel;
console.log("Admin table created");
