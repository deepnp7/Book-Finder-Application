import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // State to store form input (email, password)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State to store validation errors
  const [errors, setErrors] = useState({});

  // State to store backend server errors
  const [serverError, setServerError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate inputs
  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Run validation before sending request
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // API call for login
      const response = await axios.post(`${API_BASE_URL}api/login`, formData);

      // Successful login response handling
      if (response.data && response.data.status === "Success") {
        const { token } = response.data;

        // Decode JWT token to extract role & username
        const decoded = parseJwt(token);
        const userRole = decoded?.role || decoded?.UserRole || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userName = decoded?.username || decoded?.UserName || decoded?.sub;

        // Save token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("username", userName);

        // Redirect user based on their role
        if (userRole === "BookRecommender") {
          navigate("/bookrecommender/home");
        } else if (userRole === "BookReader") {
          navigate("/bookreader/home");
        } else {
          setServerError("Invalid role detected. Please contact support.");
        }
      } else {
        setServerError("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setServerError("Login failed. Please try again later.");
    }
  };

  // JWT DECODER
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])); // // Decode Base64 middle part of JWT
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LEFT PANEL */}
        <div className="login-left">
          <h2 className="login-subtitle">BookFinder</h2>
          <p className="login-description">
            An app to discover, explore, and recommend books tailored to your reading preferences.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <h1 className="login-title">Login</h1>

          {/* Server-side error display */}
          {serverError && <p className="error-message">{serverError}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn">Login</button>
          </form>

          {/* Forgot Password Link */}
          <p className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          {/* Signup Redirect */}
          <p className="login-footer">
            Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
