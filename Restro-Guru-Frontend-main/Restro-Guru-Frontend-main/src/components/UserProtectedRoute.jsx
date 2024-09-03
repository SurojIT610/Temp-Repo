import React from "react";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("_accesstoken");

  // Redirect to login if not authenticated
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default UserProtectedRoute;
