

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaPlusCircle, FaBookReader, FaSignOutAlt, FaUser } from "react-icons/fa";
import "./BookRecommenderNavbar.css";


const BookRecommenderNavbar = () => {
  const navigate = useNavigate();
  const [logoutPopup, setLogoutPopup] = useState(false);


  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");


  return (
    <header className="navC">
      <span className="navC-logo">BookFinder</span>


      <nav className="navC-items">
        <span className="navC-user">
          <FaUser size={15} /> {username} / {role}
        </span>


        <Link to="/bookrecommender/home" className="navC-link">
          <FaHome size={15} /> Home
        </Link>


        <div className="navC-dropdown">
          <button className="navC-dropbtn">
            <FaBook size={14} /> Books
          </button>


          <div className="navC-dropmenu">
            <Link to="/bookrecommender/add">
              <FaPlusCircle size={14} /> Add Book
            </Link>
            <Link to="/bookrecommender/view">
              <FaBookReader size={14} /> View Books
            </Link>
          </div>
        </div>


        <button className="navC-logout" onClick={() => setLogoutPopup(true)}>
          <FaSignOutAlt size={15} /> Logout
        </button>
      </nav>


      {logoutPopup && (
        <div className="navC-modal">
          <div className="navC-box">
            <h3>Are you sure?</h3>
            <p>You will be logged out of your account.</p>
            <button className="yes" onClick={() => { localStorage.clear(); navigate("/"); }}>Yes</button>
            <button className="no" onClick={() => setLogoutPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
};


export default BookRecommenderNavbar;

