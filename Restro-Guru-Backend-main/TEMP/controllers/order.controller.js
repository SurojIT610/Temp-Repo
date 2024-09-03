const mongoose = require("mongoose");
const orderModel = require("../model/order_model");
const foodModel = require("../model/food_model");

const makeOrder = async (req, res) => {
  try {
    const { user_id, items, total_price, delivery_address, payment_info } = req.body;

    // Check for required fields
    if (!user_id || !items || !total_price || !delivery_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate food items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items array" });
    }

    // Create a new order
    const newOrder = new orderModel({
      user_id,
      items,
      total_price,
      delivery_address,
      payment_info,
    });

    const result = await newOrder.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const orderInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const orders = await orderModel
      .find({ user_id: userId })
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { makeOrder, orderInfo };
