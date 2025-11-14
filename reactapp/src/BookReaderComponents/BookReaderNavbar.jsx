import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BookReaderNavbar.css';

const BookReaderNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch username and role dynamically from localStorage
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
    <div>
      <nav className="bookfinder-navbar">
        <div className="navbar-left">
          <h2>BookFinder</h2>
        </div>
        <div className="navbar-right">
          <span className="user-info">
            {username} / {role}
          </span>
          <Link to="/bookreader/home" className="nav-link">Home</Link>
          <Link to="/bookreader/view" className="nav-link">Books</Link>
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

export default BookReaderNavbar;
