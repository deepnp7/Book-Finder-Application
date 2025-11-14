import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!formData.username.trim()) tempErrors.username = "User Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    if (!formData.mobileNumber.trim()) tempErrors.mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(formData.mobileNumber))
      tempErrors.mobileNumber = "Enter a valid 10-digit mobile number";

    if (!formData.password.trim()) tempErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      tempErrors.password = "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character (e.g. Book@123)";

    if (!formData.confirmPassword.trim()) tempErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    if (!formData.userRole)
      tempErrors.userRole = "Please select a role (Book Recommender or Reader)";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.post(`${API_BASE_URL}api/register`, {
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        userRole: formData.userRole,
      });

      // Show modal on success
      setShowModal(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again later.");
    }
  };

  const handleModalOk = () => {
    setShowModal(false);
    navigate("/"); // Go to Login page
  };


  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>User Name<span className="required">*</span></label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label>Email<span className="required">*</span></label>
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Mobile Number<span className="required">*</span></label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            {errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
          </div>

          <div className="form-group">
            <label>Password<span className="required">*</span></label>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password<span className="required">*</span></label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <div className="form-group">
            <label>Role<span className="required">*</span></label>
            <select name="userRole" value={formData.userRole} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="BookRecommender">Book Recommender</option>
              <option value="BookReader">Book Reader</option>
            </select>
            {errors.userRole && <p className="error">{errors.userRole}</p>}
          </div>

          <button type="submit" className="signup-btn">Submit</button>
          <p className="login-link">Already have an account? <span onClick={() => navigate("/")}>Login</span></p>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>User Registration is Successful</h3>
            <p>Your account has been created successfully.</p>
            <button onClick={handleModalOk}>OK</button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Signup;
