const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    order_date: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: String,
      required: true,
      ref: "UserModel", // Ensure this matches the actual User model name
    },
    items: [
      {
        food_id: {
          type: String,
          // ref: "foodModel", // Ensure this matches the actual Food model name
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Shipped", "Cancelled"],
      default: "Pending",
    },
    delivery_address: {
      type: String,
      required: true,
    },
    payment_info: {
      type: String,
      default: "Pending",
    },
  },
  { versionKey: false }
);

const orderModel = mongoose.model("orderModel", orderSchema, "orderInfo");
module.exports = orderModel;
