import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaPlusCircle, FaBookReader, FaSignOutAlt, FaUser } from "react-icons/fa";
import "./BookRecommenderNavbar.css";

// Navbar component for Book Recommender application
const BookRecommenderNavbar = () => {
  const navigate = useNavigate();

  // State to control logout confirmation popup visibility
  const [logoutPopup, setLogoutPopup] = useState(false);

  // Retrieve username and role from local storage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <header className="navC">
      {/* Application Logo */}
      <span className="navC-logo">BookFinder</span>

      {/* Navigation items */}
      <nav className="navC-items">
        {/* Display logged-in user info */}
        <span className="navC-user">
          <FaUser size={15} /> {username} / {role}
        </span>

        {/* Home link */}
        <Link to="/bookrecommender/home" className="navC-link">
          <FaHome size={15} /> Home
        </Link>

        {/* Dropdown menu for Books */}
        <div className="navC-dropdown">
          <button className="navC-dropbtn">
            <FaBook size={14} /> Books
          </button>

          {/* Dropdown options */}
          <div className="navC-dropmenu">
            <Link to="/bookrecommender/add">
              <FaPlusCircle size={14} /> Add Book
            </Link>
            <Link to="/bookrecommender/view">
              <FaBookReader size={14} /> View Books
            </Link>
          </div>
        </div>

        {/* Logout button */}
        <button className="navC-logout" onClick={() => setLogoutPopup(true)}>
          <FaSignOutAlt size={15} /> Logout
        </button>
      </nav>

      {/* Logout confirmation modal */}
      {logoutPopup && (
        <div className="navC-modal">
          <div className="navC-box">
            <h3>Are you sure?</h3>
            <p>You will be logged out of your account.</p>
            {/* Confirm logout: clear local storage and navigate to home */}
            <button
              className="yes"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Yes
            </button>
            {/* Cancel logout */}
            <button className="no" onClick={() => setLogoutPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default BookRecommenderNavbar;