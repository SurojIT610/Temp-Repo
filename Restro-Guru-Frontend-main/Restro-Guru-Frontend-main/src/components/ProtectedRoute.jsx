// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("accesstoken") !== null;
  console.log(isAuthenticated)

  // Redirect to login if not authenticated
  return isAuthenticated ? element : <Navigate to="/adminLog-in" />;
};

export default ProtectedRoute;
