import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Contexts_Reducers/CartContext.jsx";

const Navbar = ({ onSearch }) => {
  // Get the cart context
  const { items } = useCart();

  // Calculate total number of items in the cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <h1 className="navbar-brand">
          Restro Guru
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/"
              >
                All Food
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/my-account">
                My Account
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <i className="fas fa-shopping-cart"></i> {cartItemCount}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
