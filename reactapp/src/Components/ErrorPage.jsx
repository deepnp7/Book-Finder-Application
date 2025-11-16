import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  // Handle button click → navigate user to correct home page based on role
  const handleGoHome = () => {
    const role = localStorage.getItem("role");

    // Redirect the user depending on their saved role
    if (role === "BookRecommender") navigate("/bookrecommender/home");
    else if (role === "BookReader") navigate("/bookreader/home");

    // If no role found → user not logged in → send to login page
    else navigate("/");
  };

  return (
    <div className="error-container">
      <div className="error-content">

        {/* Error illustration image */}
        <img
          src="/alert.png"
          alt="Error Illustration"
          className="error-image"
        />

        {/* Error heading */}
        <h1 className="error-title">Oops! Something went wrong</h1>

        {/* Short explanation message */}
        <p className="error-message">
          Please try again later or return to the home page.
        </p>

        {/* Redirect button */}
        <button className="error-button" onClick={handleGoHome}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
