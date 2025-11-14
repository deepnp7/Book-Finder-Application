import React, { useState } from "react";
import "./BookRecommenderNavbar.css";
import { Link, useNavigate } from "react-router-dom";

const BookRecommenderNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="bookfinder-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h2>BookFinder</h2>
        </div>

        <div className="navbar-right">
          <span className="user-info">
            {username} / {role}
          </span>

          <Link to="/bookrecommender/home">Home</Link>

          <div className="dropdown">
            <button className="dropbtn">Book</button>
            <div className="dropdown-content">
              <Link to="/bookrecommender/add">Add Book</Link>
              <Link to="/bookrecommender/view">View Books</Link>
            </div>
          </div>

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
