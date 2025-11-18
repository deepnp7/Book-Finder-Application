import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './BookReaderNavbar.css';

const BookReaderNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to control logout confirmation modal

  // Retrieve username and role from localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // Function to handle logout confirmation
  const handleLogoutConfirm = () => {
    // Remove user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    // Close modal and redirect to login page
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="reader-navbar">
        {/* LEFT SECTION: Brand Title */}
        <div className="nav-left">
          <h2 className="brand-title">BookFinder</h2>
        </div>

        {/* RIGHT SECTION: User Info and Navigation Links */}
        <div className="nav-right">
          {/* Display username and role */}
          <span className="user-chip">
            <FaUser size={14} /> {username} / {role}
          </span>

          {/* Navigation Links */}
          <Link to="/bookreader/home" className="nav-item">
            <FaHome className="nav-icon" /> Home
          </Link>

          <Link to="/bookreader/view" className="nav-item">
            <FaBook className="nav-icon" /> Books
          </Link>

          {/* Logout Button */}
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className="nav-icon" /> Logout
          </button>
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-box">
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-actions">
              {/* Confirm Logout */}
              <button className="confirm" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>
              {/* Cancel Logout */}
              <button className="cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReaderNavbar;
