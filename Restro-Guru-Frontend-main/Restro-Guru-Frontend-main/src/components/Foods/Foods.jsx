import React, { useState, useEffect } from "react";
import { useFood } from "../../Contexts_Reducers/FoodContext";
import { useCart } from "../../Contexts_Reducers/CartContext";
import axios from "axios";


const Foods = () => {
  const { foodItems, setFoodItems } = useFood();
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (foodItems.length === 0) {
      const fetchFoodItems = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/getAllfoods`);
          setFoodItems(response.data);
        } catch (error) {
          console.error("Error fetching food items:", error);
        }
      };

      fetchFoodItems();
    } else {
      setFilteredFoodItems(foodItems);
    }
  }, [foodItems, setFoodItems]);

  useEffect(() => {
    let filteredItems = [...foodItems];
    if (searchTerm) {
      filteredItems = filteredItems.filter(item =>
        item.food.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filter === "veg") {
      filteredItems = filteredItems.filter(item => item.type === "veg");
    } else if (filter === "non-veg") {
      filteredItems = filteredItems.filter(item => item.type === "non-veg");
    } else if (filter === "price-low") {
      filteredItems.sort((a, b) => a.price - b.price);
    } else if (filter === "price-high") {
      filteredItems.sort((a, b) => b.price - a.price);
    }
    setFilteredFoodItems(filteredItems);
  }, [filter, foodItems, searchTerm]);

  const handleIncrement = (_id) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [_id]: (prevQuantities[_id] || 0) + 1,
    }));
  };

  const handleDecrement = (_id) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [_id]: Math.max((prevQuantities[_id] || 0) - 1, 0),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 0;
    if (quantity > 0) {
      addToCart(item, quantity);
      setPopupMessage(`Added ${quantity} ${item.food} to cart.`);
      setShowPopup(true);
      setQuantities(prev => ({ ...prev, [item._id]: 0 }));
    } else {
      setPopupMessage(`Quantity for ${item.food} is zero.`);
      setShowPopup(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" href="#" onClick={() => setFilter("all")}>All</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFilter("veg")}>Veg</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFilter("non-veg")}>Non-Veg</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFilter("price-low")}>Price: Low to High</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFilter("price-high")}>Price: High to Low</a></li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "200px" }}
          />
        </div>
      </div>

      <div className="row">
        {filteredFoodItems.map((item) => (
          <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100">
              <img
                src={item.image || "/images/cards/default.jpg"}
                className="card-img-top"
                alt={item.food || "Food item"}
                style={{
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h4 className="card-title">{item.food || "Food Item"}</h4>
                <p className="card-text">
                  {item.desc || "No description available."}
                </p>
                <p className="card-text">
                  <strong>Price: ${item.price.toFixed(2)}</strong>
                </p>
                <div className="mt-auto">
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className="btn btn-outline-success me-2"
                      type="button"
                      onClick={() => handleIncrement(item._id)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-outline-danger me-2"
                      type="button"
                      onClick={() => handleDecrement(item._id)}
                      disabled={quantities[item._id] <= 0}
                    >
                      -
                    </button>
                    <p className="mb-0">Quantity: {quantities[item._id]}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={quantities[item._id] <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          aria-labelledby="popupModal"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notification</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{popupMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foods;
