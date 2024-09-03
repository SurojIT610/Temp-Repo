import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFood } from "../../Contexts_Reducers/FoodContext";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("_accesstoken");
  const { foodItems } = useFood(); // Access foodItems from context

  // Log out function
  const handleLogOut = () => {
    localStorage.removeItem("USERID");
    localStorage.removeItem("_accesstoken");
    localStorage.removeItem("_refreshtoken");
    navigate("/login"); // Redirect to login page
  };

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const userResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/userInfo`,
        {
          headers: {
            _accesstoken: token,
          },
        }
      );
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      console.error("Failed to fetch user details:", error.response || error.message);
      setError(error.message);
      navigate("/login");
    }
  };

  // Function to fetch user orders
  const fetchUserOrders = async (userId) => {
    try {
      const ordersResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/orderInfo/${userId}`,
        {
          headers: {
            _accesstoken: token,
          },
        }
      );

      if (ordersResponse.data) {
        setOrders(ordersResponse.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No orders found for this user.");
        setOrders([]);
      } else {
        console.error("Failed to fetch user orders:", error.response || error.message);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userDetails = await fetchUserDetails();
      if (userDetails) {
        await fetchUserOrders(userDetails._id);
      }
    };

    fetchData();
  }, [navigate, token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // Group orders by ID
  const groupOrdersById = (orders) => {
    return orders.reduce((acc, order) => {
      if (!acc[order._id]) {
        acc[order._id] = {
          ...order,
          items: [],
          total_price: 0
        };
      }
      acc[order._id].items.push(...order.items);
      acc[order._id].total_price += order.total_price;
      return acc;
    }, {});
  };

  // Group the orders
  const groupedOrders = groupOrdersById(orders);

  // Separate completed and pending orders
  const completedOrders = Object.values(groupedOrders).filter(order =>
    ["Completed", "Cancelled"].includes(order.status)
  );
  const pendingAndShippedOrders = Object.values(groupedOrders).filter(order =>
    ["Pending", "Shipped"].includes(order.status)
  );

  // Helper function to get food details by food_id
  const getFoodDetails = (foodId) => {
    return foodItems.find((item) => item._id === foodId) || { food: "Unknown", image: "/images/no-image.jpg" };
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Account</h2>
      <button className="btn btn-danger" onClick={handleLogOut}>
        LOG OUT
      </button>
      <ul className="nav nav-fill nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link active"
            id="tab-0"
            data-bs-toggle="tab"
            href="#tabpanel-0"
            role="tab"
            aria-controls="tabpanel-0"
            aria-selected="true"
          >
            Personal Details
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            id="tab-1"
            data-bs-toggle="tab"
            href="#tabpanel-1"
            role="tab"
            aria-controls="tabpanel-1"
            aria-selected="false"
          >
            Order History
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            id="tab-2"
            data-bs-toggle="tab"
            href="#tabpanel-2"
            role="tab"
            aria-controls="tabpanel-2"
            aria-selected="false"
          >
            Order Status
          </a>
        </li>
      </ul>
      <div className="tab-content pt-5">
        <div
          className="tab-pane fade show active"
          id="tabpanel-0"
          role="tabpanel"
          aria-labelledby="tab-0"
        >
          <h4>Personal Details</h4>
          <p>
            <strong>Name:</strong> {user.Fname} {user.Lname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.Phone}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Pin:</strong> {user.pin}
          </p>
        </div>
        <div
          className="tab-pane fade"
          id="tabpanel-1"
          role="tabpanel"
          aria-labelledby="tab-1"
        >
          <h4>Order History</h4>
          {completedOrders.length > 0 ? (
            <ul>
              {completedOrders.map((order) => (
                <li key={order._id} className="mb-3">
                  <h5>Order ID: {order._id}</h5>
                  {order.items.map((item) => {
                    const foodDetails = getFoodDetails(item.food_id);
                    return (
                      <div key={item._id} className="mb-2">
                        <p>
                          Food Item: {foodDetails.food}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total Price: {order.total_price}</p>
                        <p>Status: {order.status}</p>
                        <img
                          src={foodDetails.image}
                          alt="Food"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          ) : (
            <p>No completed orders found.</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="tabpanel-2"
          role="tabpanel"
          aria-labelledby="tab-2"
        >
          <h4>Order Status</h4>
          {pendingAndShippedOrders.length > 0 ? (
            <ul>
              {pendingAndShippedOrders.map((order) => (
                <li key={order._id} className="mb-3">
                  <h5>Order ID: {order._id}</h5>
                  {order.items.map((item) => {
                    const foodDetails = getFoodDetails(item.food_id);
                    return (
                      <div key={item._id} className="mb-2">
                        <p>
                          Food Item: {foodDetails.food}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total Price: {order.total_price}</p>
                        <p>Status: {order.status}</p>
                        <img
                          src={foodDetails.image}
                          alt="Food"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending or shipped orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
