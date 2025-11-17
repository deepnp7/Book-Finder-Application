import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  // Form State
  // Holds all input values of the signup form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  // Stores validation errors
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const particles = Array.from({ length: 25 });

  // -------------------------
  // REMOVE ERROR
  // -------------------------
  const removeError = (field) => {
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
  };

  // -------------------------
  // REAL-TIME VALIDATION
  // -------------------------
  const validateEmailLive = (email) => {
    // Gmail OR Outlook only
    const allowedEmailRegex =
      /^[^\s@]+@(gmail\.com|outlook\.com)$/i;

    if (!allowedEmailRegex.test(email)) {
      setErrors((e) => ({
        ...e,
        email: "Only Gmail or Outlook emails are allowed",
      }));
    } else {
      removeError("email");
    }
  };

  const validateMobileLive = (mobile) => {
    if (!/^[0-9]*$/.test(mobile)) return;

    if (mobile.length !== 10) {
      setErrors((e) => ({
        ...e,
        mobileNumber: "Mobile number must be 10 digits",
      }));
    } else removeError("mobileNumber");
  };

  // FIXED REAL-TIME PASSWORD MATCHING
  const validatePasswordMatchLive = (pwd, cpwd) => {
    if (cpwd.length === 0) return;

    if (pwd !== cpwd) {
      setErrors((e) => ({
        ...e,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      removeError("confirmPassword");
    }
  };

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile validation: digits only
    if (name === "mobileNumber" && !/^[0-9]*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    if (name === "email") validateEmailLive(value);

    if (name === "mobileNumber") validateMobileLive(value);

    if (name === "password") {
      analyzeStrength(value);
      validatePasswordMatchLive(value, formData.confirmPassword);
    }

    if (name === "confirmPassword") {
      validatePasswordMatchLive(formData.password, value);
    }
  };

  // -------------------------
  // PASSWORD STRENGTH
  // -------------------------
  const analyzeStrength = (pwd) => {
    if (pwd.length < 6) setPasswordStrength("Weak");
    else if (/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/i.test(pwd))
      setPasswordStrength("Strong");
    else setPasswordStrength("Medium");
  };

  // -------------------------
  // FINAL VALIDATION (Submit)
  // -------------------------
  const validate = () => {
    let temp = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.username.trim()) temp.username = "Username is required";

    if (!formData.email.trim()) temp.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      temp.email = "Enter a valid email";

    if (!formData.mobileNumber.trim())
      temp.mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(formData.mobileNumber))
      temp.mobileNumber = "Enter valid 10-digit number";

    if (!formData.password.trim()) temp.password = "Password is required";
    if (!formData.confirmPassword.trim())
      temp.confirmPassword = "Confirm Password required";

    if (formData.password !== formData.confirmPassword)
      temp.confirmPassword = "Passwords do not match";

    if (!formData.userRole) temp.userRole = "Please select a role";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before sending API request
    if (!validate()) return;

    try {
      await axios.post(`${API_BASE_URL}api/register`, formData);
      setShowModal(true);
    } catch {
      alert("Signup failed. Try again.");
    }
  };

  // -------------------------
  // CLOSE MODAL
  // -------------------------
  const closeModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="signup-container">
      {/* Floating particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">

          {/* Username */}
          <div className="floating-group">
            <input
              type="text"
              name="username"
              required
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
            />
            <label>User Name</label>
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="floating-group">
            <input
              type="text"
              name="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div className="floating-group">
            <input
              type="text"
              name="mobileNumber"
              maxLength="10"
              required
              placeholder=" "
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <label>Mobile Number</label>
            {errors.mobileNumber && (
              <p className="error">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="floating-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>

            <button
              type="button"
              className={`eye-btn ${showPassword ? "active" : ""}`}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8-11 8-4 8 11 8 11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.33 21.33 0 0 1 5.06-6.04" />
                  <path d="M1 1l22 22" />
                </svg>
              )}
            </button>

            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* Strength Meter */}
          {formData.password && (
            <p className={`strength ${passwordStrength.toLowerCase()}`}>
              Strength: {passwordStrength}
            </p>
          )}

          {/* Confirm Password */}
<div className="floating-group password-wrapper">
  <input
    type={showCPassword ? "text" : "password"}
    name="confirmPassword"
    required
    placeholder=" "
    value={formData.confirmPassword}
    onChange={handleChange}
  />
  <label>Confirm Password</label>

  <button
    type="button"
    className={`eye-btn ${showCPassword ? "active" : ""}`}
    onClick={() => setShowCPassword((s) => !s)}
  >
    {showCPassword ? (
      <svg viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8-11 8-4 8 11 8 11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.33 21.33 0 0 1 5.06-6.04" />
        <path d="M1 1l22 22" />
      </svg>
    )}
  </button>

</div>

{/* ERROR BELOW INPUT */}
{errors.confirmPassword && (
  <p className="error below">{errors.confirmPassword}</p>
)}


          {/* Role Dropdown */}
          <div className="dropdown-group">
            <label>Choose Role</label>

            <div className="dropdown-wrapper">
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="BookRecommender">Book Recommender</option>
                <option value="BookReader">Book Reader</option>
              </select>

              <span className="dropdown-arrow">▾</span>
            </div>

            {errors.userRole && <p className="error">{errors.userRole}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Registration Successful 🎉</h3>
            <p>Your account has been created successfully.</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
