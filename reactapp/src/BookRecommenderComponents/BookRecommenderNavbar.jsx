import React, { useState } from "react";
import "./BookRecommenderNavbar.css";
import { Link, useNavigate } from "react-router-dom";

const BookRecommenderNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get logged-in user details from localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // Handle logout confirmation: clears auth data and redirects to login
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="bookfinder-container">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        {/* Title */}
        <div className="navbar-left">
          <h2>BookFinder</h2>
        </div>

        {/* Right-side menu items */}
        <div className="navbar-right">
          {/* Username / Role display */}
          <span className="user-info">
            {username} / {role}
          </span>

          {/* Navigation links */}
          <Link to="/bookrecommender/home">Home</Link>

          {/* Dropdown for Book operations */}
          <div className="dropdown">
            <button className="dropbtn">Book</button>
            <div className="dropdown-content">
              <Link to="/bookrecommender/add">Add Book</Link>
              <Link to="/bookrecommender/view">View Books</Link>
            </div>
          </div>

          {/* Logout button triggers confirmation modal */}
          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h3>Are you sure you want to logout?</h3>

            {/* Modal action buttons */}
            <div className="logout-btn-group">
              <button className="confirm-btn" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>

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

export default BookRecommenderNavbar;
