const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const UserModel = require("../model/user_model");
const {
  createAccess_token,
  createRefresh_token,
} = require("../helpers/jwt_helper");

const register = async (req, res) => {
  try {
    const { Fname, Lname, Phone, address, pin, email, password } = req.body;
    if (!Fname || !Lname || !Phone || !address || !pin || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newUser = new UserModel({
      Fname,
      Lname,
      Phone,
      address,
      pin,
      email,
      password,
    });

    const info = await newUser.save();
    return res.status(200).json(info);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already registered." });
    }
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    let loginInfo = await UserModel.findOne({ email: req.body.email });
    if (!loginInfo) {
      return res.status(500).json({ message: "Email not registered" });
    }

    let isPassvalid = loginInfo.validateFunction(
      req.body.password,
      loginInfo.password
    );
    if (isPassvalid) {
      return res.status(200).json({
        email: loginInfo.email,
        userId:loginInfo._id,
        _accessToken: await createAccess_token(loginInfo.email, loginInfo._id),
        _refreshToken: await createRefresh_token(
          loginInfo.email,
          loginInfo._id
        ),
        
      });
      
    } else {
      return res.status(500).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const new_refresh_token = async (req, res) => {
  try {
    const write_data = crypto.randomBytes(16).toString("hex");
    fs.writeFileSync(
      __dirname + "/../config/refresh_token_key.text",
      write_data
    );
    return res.status(200).json({
      _newRefreshToken: await createRefresh_token(
        req.decode.email,
        req.decode._id
      ),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const new_access_token = async (req, res) => {
  try {
    let loginInfo = await UserModel.findOne({ email: req.decode.email });
    if (!loginInfo) {
      return res.status(500).json({ message: "Email not registered" });
    }
    return res.status(200).json({
      email: loginInfo.email,
      _accessToken: await createAccess_token(loginInfo.email, loginInfo._id),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.decode._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const userInfoById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  try {
    const delUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!delUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User has been deleted" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const editUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    Object.keys(updates).forEach((key) => {
      if (user[key] !== undefined && key !== "_id") {
        // Exclude _id and only update existing fields
        user[key] = updates[key];
      }
    });

    // Save updated user
    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  new_refresh_token,
  new_access_token,
  userInfo,
  deleteUser,
  userInfoById,
  editUser,
};
console.log("User controller ready to use");
