import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");
  const otp = params.get("otp");

  const handleReset = async () => {
    try {
      await axios.post(`${API_BASE_URL}api/reset-password`, {
        email,
        otp,
        newPassword
      });

      alert("Password reset successful!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed.";
      alert(msg);
    }
  };


  return (
    <div className="reset-container">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
