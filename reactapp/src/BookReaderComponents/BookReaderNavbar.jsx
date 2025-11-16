import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BookReaderNavbar.css';

const BookReaderNavbar = () => {
  const navigate = useNavigate();

  // State to toggle logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch username & role from localStorage (set during login)
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // Handles logout: clears user data & redirects to login page
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <nav className="bookfinder-navbar">
        <div className="navbar-left">
          <h2>BookFinder</h2>
        </div>

        <div className="navbar-right">
          {/* Display logged-in user's name and role */}
          <span className="user-info">
            {username} / {role}
          </span>

          {/* Navigation Links */}
          <Link to="/bookreader/home" className="nav-link">Home</Link>
          <Link to="/bookreader/view" className="nav-link">Books</Link>

          {/* Logout Button */}
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h3>Are you sure you want to logout?</h3>

            {/* Modal Buttons */}
            <div className="logout-btn-group">
              {/* Confirm Logout */}
              <button className="confirm-btn" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>

              {/* Cancel Logout */}
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
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
