import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import "./VerifyOtp.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [showModal, setShowModal] = useState(false); //  Modal state
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const particles = Array.from({ length: 25 });

  const handleVerify = async () => {
    try {
      await axios.post(`${API_BASE_URL}api/verify-otp`, { email, otp });

      //  Open success modal
      setShowModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP.";
      alert(msg);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate(`/reset-password?email=${email}&otp=${otp}`); // Move to next page
  };

  return (
    <div className="otp-container">
      {/* Floating Particles */}
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

      {/* SUCCESS MODAL */}
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
