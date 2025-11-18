import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  // State to store the OTP entered by the user
  const [otp, setOtp] = useState("");

  // Controls visibility of success modal
  const [showModal, setShowModal] = useState(false);

  // Read email from query params (set on previous page)
  const [params] = useSearchParams();
  const email = params.get("email");

  // For navigation after successful verification
  const navigate = useNavigate();

  // Generate particles for animated background
  const particles = Array.from({ length: 25 });

  // Verify OTP against backend
  const handleVerify = async () => {
    try {
      // API call to verify OTP with email and otp
      await axios.post(`${API_BASE_URL}api/verify-otp`, { email, otp });

      // Open success modal on successful verification
      setShowModal(true);
    } catch (err) {
      // If backend sends specific message → show it, else show fallback message
      const msg = err.response?.data?.message || "Invalid OTP.";
      alert(msg);
    }
  };

  // Close modal and proceed to reset-password screen with query params
  const closeModal = () => {
    setShowModal(false);
    navigate(`/reset-password?email=${email}&otp=${otp}`); // Move to next page
  };

  return (
    <div className="otp-container">
      {/* Floating Particles for background effect */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="otp-particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* OTP input card */}
      <div className="otp-card">
        <h2>Verify OTP</h2>
        <p>OTP sent to: <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify}>Verify</button>
      </div>

      {/* SUCCESS MODAL shown after OTP verification */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>OTP Verified Successfully 🎉</h3>
            <p>Redirecting you to reset your password.</p>
            <button onClick={closeModal}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyOtp;
