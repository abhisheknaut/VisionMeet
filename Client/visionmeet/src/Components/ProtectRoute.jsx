// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or check auth context

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default PrivateRoute;
