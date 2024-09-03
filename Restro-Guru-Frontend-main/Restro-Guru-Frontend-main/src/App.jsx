import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Foods from "./components/Foods/Foods.jsx";
import MyAccount from "./components/Account/MyAccount.jsx";
import Cart from "./components/cart/Cart.jsx";
import { CartProvider } from "./Contexts_Reducers/CartContext.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Login/Signup.jsx";
import Admin from "./components/Admin/Admin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx"; // Corrected import
import { FoodProvider } from "./Contexts_Reducers/FoodContext.jsx";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {

  return (
    <FoodProvider>
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/adminLog-in" element={<AdminLogin />} />
          <Route exact path="/" element={<Foods />} />
          <Route exact path="/place-order" element={<PlaceOrder />} />
          
          <Route
            exact
            path="/my-account"
            element={<UserProtectedRoute element={<MyAccount />} />} // Protect MyAccount route
          />

          <Route
            exact
            path="/admin"
            element={<ProtectedRoute element={<Admin />} />} // Protect Admin route
          />
          <Route exact path="/cart" element={<Cart />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </CartProvider>
    </FoodProvider>

  );
}

export default App;
