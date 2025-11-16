import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await axios.post(`${API_BASE_URL}api/verify-otp`, { email, otp });

      alert("OTP verified successfully.");
      navigate(`/reset-password?email=${email}&otp=${otp}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP.";
      alert(msg);
    }
  };


  return (
    <div className="otp-container">
      <h2>Verify OTP</h2>
      <p>OTP sent to: {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}

export default VerifyOtp;
