import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const ForgotPassword = () => {
  // Manage email input state
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Handle form submission → send email to backend to trigger OTP
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
      <h2>Forgot Password</h2>

      {/* Email Input Field */}
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      {/* Submit Button to Request OTP */}
      <button onClick={handleSubmit}>Send OTP</button>
    </div>
  );
}

export default ForgotPassword;
