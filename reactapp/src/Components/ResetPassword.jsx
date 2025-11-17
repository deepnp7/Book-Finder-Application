import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "./ResetPassword.css";

const ResetPassword = () => {
  // State for the new password input
  const [newPassword, setNewPassword] = useState("");

  // Controls visibility of success modal
  const [showModal, setShowModal] = useState(false);

  // Read email and otp from URL query params
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Extract email and OTP from the URL query parameters
  const email = params.get("email");
  const otp = params.get("otp");

  // Particles used for background animation
  const particles = Array.from({ length: 25 });

  // Submit new password to backend
  const handleReset = async () => {
    try {
      // Send reset request to backend
      await axios.post(`${API_BASE_URL}api/reset-password`, {
        email,
        otp,
        newPassword,
      });

      // On success, show confirmation modal
      setShowModal(true);
    } catch (err) {
      // Show backend message if available
      const msg = err.response?.data?.message || "Password reset failed.";
      alert(msg);
    }
  };

  // Close modal and redirect user (back to login/landing)
  const closeModal = () => {
    setShowModal(false);
    navigate("/"); // Redirect after closing modal
  };

  return (
    <div className="reset-container">
      {/* Floating particles for animated background */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="reset-particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Reset password card */}
      <div className="reset-card">
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleReset}>Reset Password</button>
      </div>

      {/* SUCCESS MODAL - shown after password reset */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Password Reset Successful 🎉</h3>
            <p>Your password has been updated.</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
