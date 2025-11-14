import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Helper to get token and role from localStorage
const getAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return { token, role };
};

function PrivateRoute({ allowedRoles }) {
  const { token, role } = getAuth();

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If role restriction exists and current user role is not allowed, redirect to error/unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  // If authenticated and authorized, allow access
  return <Outlet />;
};

export default PrivateRoute;
