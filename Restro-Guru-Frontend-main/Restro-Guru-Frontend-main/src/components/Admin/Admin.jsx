import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  const token = localStorage.getItem("accesstoken");
  const [updateDesc, setUpdateDesc] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateImage, setUpdateImage] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const clickToSetCompleted = (orderId) => {
    handleStatus(orderId, "Completed");
  };

  const handleStatus = async (orderId, status) => {
    if (window.confirm("Are you sure you want to update the status?")) {
      try {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/UpdateOrderStatus/${orderId}`,
          { status },
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setSelectedStatus(status);
        alert("Order status updated successfully");
      } catch (err) {
        setError(err.message);
        alert("Failed to update order status");
      }
    }
  };

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const [foodName, setFoodName] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodType, setFoodType] = useState("");
  const [foodImage, setFoodImage] = useState(null);

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const isCheck = localStorage.getItem("accesstoken");
    if (!isCheck) {
      navigate("/adminlog-in"); // Surojit changeddd ahola
      return;
    }

    const fetchUsers = async () => {
      try {
        if (!token) {
          navigate("/adminlog-in"); // Surojit changeddd ahola
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/adminGetuserInfo`,
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(true);
      }
    };

    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/getAllfoods`,
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(true);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/adminGetOrderInfo`,
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(true);
      }
    };

    fetchDishes();

    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "food") {
      fetchDishes();
    }
  }, [activeTab, navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    navigate("/login");
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/v1/deleteUser/${userId}`,
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDishDelete = async (dishId) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/v1/deleteFoodById/${dishId}`,
          {
            headers: {
              accesstoken: token,
            },
          }
        );
        setDishes(dishes.filter((dish) => dish._id !== dishId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdateDish = async (id) => {
    if (!selectedDish) return;
    const formData = new FormData();
    formData.append("food", updateName || selectedDish.food);
    formData.append("desc", updateDesc || selectedDish.desc);
    formData.append("price", updatePrice || selectedDish.price);
    if (updateImage) {
      formData.append("image", updateImage);
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/updateFoodItems/${id}`,
        formData,
        {
          headers: {
            accesstoken: token,
          },
        }
      );
      setDishes(
        dishes.map((dish) =>
          dish._id === id ? { ...dish, ...response.data } : dish
        )
      );
      setSelectedDish(null);
      setUpdateDesc("");
      setUpdateName("");
      setUpdatePrice("");
      setUpdateImage(null);
    } catch (err) {
      setError("Failed to update dish");
    }
  };

  const handleChange = (event, field) => {
    const value =
      field === "image" ? event.target.files[0] : event.target.value;
    if (field === "desc") {
      setUpdateDesc(value);
    } else if (field === "name") {
      setUpdateName(value);
    } else if (field === "price") {
      setUpdatePrice(value);
    } else if (field === "image") {
      setUpdateImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("food", foodName);
    formData.append("desc", foodDesc);
    formData.append("price", foodPrice);
    formData.append("type", foodType);
    if (foodImage) {
      formData.append("image", foodImage);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/addNewFoodItems`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accesstoken: token,
          },
        }
      );
      setFoodName("");
      setFoodDesc("");
      setFoodPrice("");
      setFoodType("");
      setFoodImage(null);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/getAllfoods`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDishes(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const filterDishes = (dishes) => {
    switch (filter) {
      case "veg":
        return dishes.filter((dish) => dish.type === "veg");
      case "non-veg":
        return dishes.filter((dish) => dish.type === "non-veg");
      case "price-low":
        return [...dishes].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...dishes].sort((a, b) => b.price - a.price);
      case "all":
      default:
        return dishes;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        if (loading) return <div className="p-3">Loading...</div>;
        if (error) return <div className="p-3 text-danger">Error: {error}</div>;
        return (
          <div className="p-3">
            <h3>Users</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>PIN</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.Fname}</td>
                    <td>{user.Lname}</td>
                    <td>{user.Phone}</td>
                    <td>{user.address}</td>
                    <td>{user.pin}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "orders":
        if (loading) return <div className="p-3">Loading...</div>;
        if (error) return <div className="p-3 text-danger">Error: {error}</div>;
        return (
          <div className="p-3">
            <h3>Orders</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => clickToSetCompleted(order._id)}
                      >
                        Set Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "food":
        if (loading) return <div className="p-3">Loading...</div>;
        if (error) return <div className="p-3 text-danger">Error: {error}</div>;
        return (
          <div className="p-3">
            <h3>Food Items</h3>
            <div className="mb-3">
              <label htmlFor="filter" className="form-label">
                Filter:
              </label>
              <select
                id="filter"
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterDishes(dishes).map((dish) => (
                  <tr key={dish._id}>
                    <td>{dish.food}</td>
                    <td>{dish.desc}</td>
                    <td>{dish.price}</td>
                    <td>
                      <img
                        src={dish.imageUrl}
                        alt={dish.food}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedDish(dish);
                          setUpdateDesc(dish.desc);
                          setUpdateName(dish.food);
                          setUpdatePrice(dish.price);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => handleDishDelete(dish._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedDish && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateDish(selectedDish._id);
                }}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label htmlFor="updateName" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateName"
                    value={updateName}
                    onChange={(e) => handleChange(e, "name")} // Surojit changeddd ahola
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="updateDesc" className="form-label">
                    Description:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="updateDesc"
                    value={updateDesc}
                    onChange={(e) => handleChange(e, "desc")} // Surojit changeddd ahola
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="updatePrice" className="form-label">
                    Price:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="updatePrice"
                    value={updatePrice}
                    onChange={(e) => handleChange(e, "price")} // Surojit changeddd ahola
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="updateImage" className="form-label">
                    Image:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="updateImage"
                    onChange={(e) => handleChange(e, "image")} // Surojit changeddd ahola
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            )}
            <h3 className="mt-4">Add New Food Item</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="foodName" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="foodName"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="foodDesc" className="form-label">
                  Description:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="foodDesc"
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="foodPrice" className="form-label">
                  Price:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="foodPrice"
                  value={foodPrice}
                  onChange={(e) => setFoodPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="foodType" className="form-label">
                  Type:
                </label>
                <select
                  id="foodType"
                  className="form-select"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="foodImage" className="form-label">
                  Image:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="foodImage"
                  onChange={(e) => setFoodImage(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Food Item
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={() => setActiveTab("users")}>
          Users
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveTab("orders")}>
          Orders
        </button>
        <button className="btn btn-secondary" onClick={() => setActiveTab("food")}>
          Food
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Admin;
