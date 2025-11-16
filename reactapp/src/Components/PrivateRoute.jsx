import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Auth Helper
// Fetches JWT token and user role from localStorage.
// Used to check if the user is authenticated and authorized.
const getAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return { token, role };
};

const PrivateRoute = ({ allowedRoles }) => {
  const { token, role } = getAuth();

  // Auth Check
  // If user is not logged in → redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role Authorization Check
  // If route has restricted roles and the user's role isn't allowed
  // → redirect them to the error/unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  // Allow Access
  // If authenticated AND authorized → load the nested route (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
