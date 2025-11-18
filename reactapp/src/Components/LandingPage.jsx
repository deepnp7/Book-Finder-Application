import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Generate 40 particles for animated landing background
  const particles = Array.from({ length: 40 });

  return (
    <div className="landing-container">
      {/* PARTICLES - decorative floating elements in background */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            opacity: 0.3 + Math.random() * 0.4,
            transform: `scale(${0.5 + Math.random() * 1.5})`,
          }}
        ></div>
      ))}

      {/* NAVBAR with logo and anchor links for page sections */}
      <nav className="landing-navbar">
        <div className="landing-logo">BookFinder</div>

        <ul className="landing-nav-links">
          <li className="lang-label">EN</li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>

      {/* HERO SECTION with main pitch and call-to-action */}
      <section id="home" className="landing-hero">
        <div className="hero-left">
          <h1 className="hero-title fade-in">
            Discover Books.<br />Explore Genres.
          </h1>

          <p className="hero-subtitle slide-up">
            Your personalized gateway to reading and book recommendations.
          </p>

          {/* Primary CTA button to go to login page */}
          <button
            className="cta-button bounce"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

        {/* Right side illustration image */}
        <div className="hero-right">
          <img
            src="/7006038.jpg"
            alt="Landing Visual"
            className="landing-hero-image fade-in-img"
          />
        </div>
      </section>

      {/* ABOUT SECTION describing the platform */}
      <section id="about" className="landing-about">
        <h2>About Us</h2>
        <p>
          BookFinder helps readers discover books tailored to their interests.
          Whether you are a book lover or a book recommender, our platform makes
          exploring, adding, and reviewing books easier than ever.
        </p>
      </section>

      {/* CONTACT SECTION with basic contact info */}
      <section id="contact" className="landing-contact">
        <h2>Contact Us</h2>
        <p>Email: <span>bookfinderstatuscode6@gmail.com</span></p>
        <p>Phone: <span>+91 9876543210</span></p>
      </section>
    </div>
  );
}

export default LandingPage;
