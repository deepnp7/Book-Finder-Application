import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Send OTP</button>
    </div>
  );
}

export default ForgotPassword;
