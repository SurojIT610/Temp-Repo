import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("_accesstoken");
  const userId = localStorage.getItem("USERID");

  const { orderData } = location.state || {}; // Safely access the passed data

  if (!orderData) {
    return <p>No order data available. Please return to the cart and try again.</p>;
  }

  const { items, totalPrice } = orderData;

  const orderPlaceFun = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderResponse = await axios.post(
        "https://restro-guru-backend-production.up.railway.app/api/v1/place-order",
        {
          user_id: userId,
          items: items.map(item => ({
            food_id: item._id,
            quantity: item.quantity,
          })),
          total_price: totalPrice,
          delivery_address: address,
          payment_info: paymentMethod
        },
        {
          headers: {
            _accesstoken: token // Use Bearer token in header
          },
        }
      );
      console.log(orderResponse.data);
      navigate("/my-account"); // Redirect to success page
    } catch (error) {
      console.error("Failed to place order:", error.response || error.message);
      setError("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h4>Review Your Order</h4>
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item._id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>
              {item.food} (x{item.quantity})
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <strong>Total Price: ${totalPrice.toFixed(2)}</strong>
        {userId && <p>User ID: {userId}</p>}
        <div className="m-3">
          <label htmlFor="paymentMethod" className="form-label">
            Payment Method
          </label>
          <input
            type="text"
            className="form-control"
            id="paymentMethod"
            placeholder="Enter payment method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            className="form-control"
            id="address"
            rows="3"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
        <button
          className="btn btn-primary"
          onClick={orderPlaceFun}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Order"}
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default PlaceOrder;
