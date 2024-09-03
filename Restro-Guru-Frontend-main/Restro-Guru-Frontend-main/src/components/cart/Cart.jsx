import React from 'react';
import { useCart } from '../../Contexts_Reducers/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  
  const navigate = useNavigate();
  const { items, getTotalPrice, removeFromCart, updateItemQuantity } = useCart();

  const incrementQuantity = (id) => {
    const item = items.find((item) => item._id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    } else {
      console.error(`Item with id ${id} not found.`);
    }
  };

  const decrementQuantity = (id) => {
    const item = items.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    } else {
      console.error(`Item with id ${id} not found or quantity is already 1.`);
    }
  };

  const totalPrice = getTotalPrice(); // Use the context method to get total price

  const handlePlaceOrder = () => {
    const accessToken = localStorage.getItem('_accesstoken');
    
 

    if (!accessToken) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }

    // Prepare order data
    const orderData = {
      items,
      totalPrice
    };

    // Navigate to place-order with orderData
    navigate('/place-order', { state: { orderData } });
  };

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header">
          <h4 className="mb-0">Your Cart</h4>
        </div>
        <ul className="list-group list-group-flush">
          {items.length === 0 ? (
            <li className="list-group-item text-center">Your cart is empty.</li>
          ) : (
            items.map((item) => (
              <li
                key={item._id} // Use unique _id as key
                className="list-group-item d-flex align-items-center"
              >
                <img
                  src={item.image || "/images/cards/default.jpg"}
                  alt={item.food || "Item image"}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                  className="me-3"
                />
                <div className="d-flex flex-column me-3">
                  <span className="fw-bold">{item.food}</span>
                  <span>{item.desc || "No description available."}</span>
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      -
                    </button>
                    <span className="me-3">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ms-auto d-flex align-items-center">
                  <span className="fw-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-danger btn-sm ms-3"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="card-footer text-end">
          <strong>Total Price: ${totalPrice.toFixed(2)}</strong>
          <button onClick={handlePlaceOrder} className="btn btn-primary ms-3">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
