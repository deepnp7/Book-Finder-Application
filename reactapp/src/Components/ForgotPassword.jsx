import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  // Manage email input state
  const [email, setEmail] = useState("");

  // For redirecting to OTP verification page
  const navigate = useNavigate();

  // Generate floating particles for animated background
  const particles = Array.from({ length: 25 });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call to backend Forgot Password endpoint
      await axios.post(`${API_BASE_URL}api/forgot-password`, { email });

      // Navigate to OTP verification screen with email as query param
      navigate(`/verify-otp?email=${email}`);
    } catch (err) {
      // Show backend error if present, else fallback message
      const msg = err.response?.data?.message || "Something went wrong.";
      alert(msg);
    }
  };

  return (
    <div className="forgot-container">
      {/* Background Particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="forgot-particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Glassmorphic Card for Forgot Password form */}
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        {/* Submit email to receive OTP */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
