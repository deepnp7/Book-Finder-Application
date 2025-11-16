import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const ResetPassword = () => {
  // State for the new password input
  const [newPassword, setNewPassword] = useState("");

  // Reading query parameters from URL → ?email=...&otp=...
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Extract email and OTP from the URL query parameters
  const email = params.get("email");
  const otp = params.get("otp");

  // Handle Password Reset --------------------
  const handleReset = async () => {
    try {
      // Send reset request to backend
      await axios.post(`${API_BASE_URL}api/reset-password`, {
        email,
        otp,
        newPassword
      });

      alert("Password reset successful!");
      navigate("/"); // Redirect to login page
    } catch (err) {
      // Show backend message if available
      const msg = err.response?.data?.message || "Password reset failed.";
      alert(msg);
    }
  };


  return (
    <div className="reset-container">
      <h2>Reset Password</h2>

      {/* New Password Input Field */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* Reset Password Button */}
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
