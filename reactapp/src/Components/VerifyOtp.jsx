import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const VerifyOtp = () => {
  // State to store the OTP entered by the user
  const [otp, setOtp] = useState("");

  // Extract query parameters from the URL (email comes from previous page)
  const [params] = useSearchParams();
  const email = params.get("email");

  // For navigation after successful verification
  const navigate = useNavigate();

  // Function to verify OTP by calling backend API
  const handleVerify = async () => {
    try {
      // API call to verify OTP with email and otp
      await axios.post(`${API_BASE_URL}api/verify-otp`, { email, otp });

      // If OTP verified → alert and navigate to reset-password page
      alert("OTP verified successfully.");
      navigate(`/reset-password?email=${email}&otp=${otp}`);
    } catch (err) {
      // If backend sends specific message → show it, else show fallback message
      const msg = err.response?.data?.message || "Invalid OTP.";
      alert(msg);
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify OTP</h2>

      {/* Display the email where OTP was sent */}
      <p>OTP sent to: {email}</p>

      {/* Input field for the user to enter OTP */}
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {/* Button to trigger OTP verification */}
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyOtp;
