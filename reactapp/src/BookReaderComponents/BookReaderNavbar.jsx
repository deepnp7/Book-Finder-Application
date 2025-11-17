import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './BookReaderNavbar.css';




const BookReaderNavbar = () => {
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
    <div>
      <nav className="reader-navbar">
        {/* LEFT */}
        <div className="nav-left">
          <h2 className="brand-title">BookFinder</h2>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <span className="user-chip">
            <FaUser size={14} /> {username} / {role}
          </span>

          <Link to="/bookreader/home" className="nav-item">
            <FaHome className="nav-icon" /> Home
          </Link>

          <Link to="/bookreader/view" className="nav-item">
            <FaBook className="nav-icon" /> Books
          </Link>

          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className="nav-icon" /> Logout
          </button>
        </div>
      </nav>




      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-box">
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-actions">
              <button className="confirm" onClick={handleLogoutConfirm}>
                Yes, Logout
              </button>
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

