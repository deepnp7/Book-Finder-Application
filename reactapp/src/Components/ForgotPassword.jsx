import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Generate floating particles
  const particles = Array.from({ length: 25 });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}api/forgot-password`, { email });
      navigate(`/verify-otp?email=${email}`);
    } catch (err) {
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

      {/* Glassmorphic Card */}
      <div className="forgot-card">
        <h2>Forgot Password</h2>

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
