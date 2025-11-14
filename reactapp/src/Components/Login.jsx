import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate inputs
  const validate = () => {
    const newErrors = {};
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

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}api/login`, formData);
      if (response.data && response.data.status === "Success") {
        const { token } = response.data;
        // Decode token (or extract role from backend response)
        const decoded = parseJwt(token);
        const userRole = decoded?.role || decoded?.UserRole || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const userName = decoded?.username || decoded?.UserName || decoded?.sub;

        // Store JWT in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("username", userName);

        // Redirect based on role
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

  // Decode JWT to extract role
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Section */}
        <div className="login-left">
          <h2 className="login-subtitle">BookFinder</h2>
          <p className="login-description">
            An app to discover, explore, and recommend books tailored to your reading preferences.
          </p>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <h1 className="login-title">Login</h1>

          {serverError && <p className="error-message">{serverError}</p>}

          <form onSubmit={handleSubmit} noValidate>
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

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="login-footer">
            Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
