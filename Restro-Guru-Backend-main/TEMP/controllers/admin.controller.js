const mongoose = require("mongoose");
const AdminModel = require("../model/admin_model");
const UserModel = require("../model/user_model");
const OrderModel = require("../model/order_model");
const {
  createAccess_token,
  createRefresh_token,
} = require("../helpers/jwt_helper");

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await AdminModel.findOne({ email });

    if (!admin) {
      return res.status(500).json({ message: "Email not registered" });
    }

    let isPassValid = admin.validateFunction(password, admin.password);
    if (isPassValid) {
      return res.status(200).json({
        email: admin.email,
        _accessToken: await createAccess_token(admin.email, admin._id),
        _refreshToken: await createRefresh_token(admin.email, admin._id),
      });
    } else {
      return res.status(500).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newUser = new AdminModel({
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

// Fetch All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// Delete User by ID
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

// Fetch Orders Related to User
const getAllOrders = async (req, res) => {
  // if (!mongoose.isValidObjectId(req.params.userId)) {
  //   return res.status(400).json({ message: "Invalid User ID" });
  // }
  try {
    const orders = await OrderModel.find({});
    // console.log(orders);
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }
    return res.status(200).json(orders);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const updateOrderStatus = async (req, res) => {
  if (req.method === "PUT" || req.method === "PATCH") {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    // Validate status
    // const validStatuses = ["Pending", "Completed", "Shipped", "Cancelled"];
    // if (!validStatuses.includes(status)) {
    //   return res.status(400).json({ message: "Invalid status" });
    // }

    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true}
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ message: `${req.method} method not allowed for this endpoint` });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  deleteUser,
  getAllOrders,
  register,
  updateOrderStatus
};
