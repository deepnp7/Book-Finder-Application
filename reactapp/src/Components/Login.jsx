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

  // Show/Hide Password Toggle
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

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

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  // JWT decoding helper
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // API call for login
      const response = await axios.post(`${API_BASE_URL}api/login`, formData);

      if (response.data && response.data.status === "Success") {
        const { token } = response.data;
        const decoded = parseJwt(token);

        const userRole =
          decoded?.role ||
          decoded?.UserRole ||
          decoded?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        const userName = decoded?.username || decoded?.UserName || decoded?.sub;

        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("username", userName);

        if (userRole === "BookRecommender") navigate("/bookrecommender/home");
        else if (userRole === "BookReader") navigate("/bookreader/home");
        else setServerError("Invalid role detected. Please contact support.");
      } else {
        setServerError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setServerError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <h2 className="login-subtitle">BookFinder</h2>
          <p className="login-description">
            An app to discover, explore, and recommend books tailored to your reading preferences.
          </p>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h1 className="login-title">Login</h1>

          {/* Server-side error display */}
          {serverError && <p className="error-message">{serverError}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Email */}
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
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* Password + Eye Toggle */}
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                />

                {/* Eye Button */}
                <button
                  type="button"
                  className={`eye-btn ${showPassword ? "active" : ""}`}
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    /* Eye open */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    /* Eye closed */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.33 21.33 0 0 1 5.06-6.04" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            {/* Forgot Password */}
            <p className="forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>

            {/* Submit */}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
