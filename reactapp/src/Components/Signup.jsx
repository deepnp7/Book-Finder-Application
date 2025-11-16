import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  // Form State
  // Holds all input values of the signup form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });

  // Stores validation errors
  const [errors, setErrors] = useState({});

  // Controls the success modal visibility
  const [showModal, setShowModal] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Validation
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Username validation
    if (!formData.username.trim()) tempErrors.username = "User Name is required";

    // Email validation
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      tempErrors.email = "Enter a valid email address";

    // Mobile number validation
    if (!formData.mobileNumber.trim()) tempErrors.mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(formData.mobileNumber))
      tempErrors.mobileNumber = "Enter a valid 10-digit mobile number";

    // Password validation
    if (!formData.password.trim()) tempErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      tempErrors.password = "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character (e.g. Book@123)";

    // Confirm password validation
    if (!formData.confirmPassword.trim()) tempErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    // Role validation
    if (!formData.userRole)
      tempErrors.userRole = "Please select a role (Book Recommender or Reader)";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before sending API request
    if (!validate()) return;

    try {
      // Send signup request to backend
      await axios.post(`${API_BASE_URL}api/register`, {
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        userRole: formData.userRole,
      });

      // Show modal on successful registration
      setShowModal(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again later.");
    }
  };

  // Handle modal OK button → redirect to login page
  const handleModalOk = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup</h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Username */}
          <div className="form-group">
            <label>User Name<span className="required">*</span></label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email<span className="required">*</span></label>
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label>Mobile Number<span className="required">*</span></label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            {errors.mobileNumber && <p className="error">{errors.mobileNumber}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password<span className="required">*</span></label>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password<span className="required">*</span></label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>Role<span className="required">*</span></label>
            <select name="userRole" value={formData.userRole} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="BookRecommender">Book Recommender</option>
              <option value="BookReader">Book Reader</option>
            </select>
            {errors.userRole && <p className="error">{errors.userRole}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-btn">Submit</button>

          {/* Redirect to login */}
          <p className="login-link">Already have an account? <span onClick={() => navigate("/")}>Login</span></p>
        </form>
      </div>

      {/* Success Modal */}
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
