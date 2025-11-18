import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

/* React Icons */
import { FaBookOpen, FaGlobe, FaInfoCircle, FaEnvelope, FaPhoneAlt, FaArrowRight } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const particles = Array.from({ length: 40 });


  return (
    <div className="landing-container">

      {/* PARTICLES */}
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

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <FaBookOpen className="logo-icon" /> BookFinder
        </div>

        <ul className="landing-nav-links">
          <li className="lang-label"><FaGlobe /> EN</li>
          <li><a href="#about"><FaInfoCircle /> About Us</a></li>
          <li><a href="#contact"><FaEnvelope /> Contact Us</a></li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="landing-hero">
        <div className="hero-left">
          <h1 className="hero-title fade-in">
            Discover Books.<br />Explore Genres.
          </h1>

          <p className="hero-subtitle slide-up">
            Your personalized gateway to reading and book recommendations.
          </p>

          <button
            className="cta-button bounce"
            onClick={() => navigate("/login")}
          >
            Get Started <FaArrowRight className="cta-icon" />
          </button>
        </div>

        <div className="hero-right">
          <img
            src="/7006038.jpg"
            alt="Landing Visual"
            className="landing-hero-image fade-in-img"
          />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="landing-about">
        <h2><FaInfoCircle className="section-icon" /> About Us</h2>

        <p className="about-text">
          BookFinder helps readers discover books tailored to their interests.
          Whether you are a book lover or a book recommender, our platform makes
          exploring, adding, and reviewing books easier than ever.
        </p>

        {/* Feature Cards */}
        <div className="about-features">
          <div className="feature-card">
            <FaBookOpen className="feature-icon" />
            <h3>Smart Book Discovery</h3>
            <p>Find books effortlessly with personalized recommendations and smart filters.</p>
          </div>

          <div className="feature-card">
            <FaInfoCircle className="feature-icon" />
            <h3>Genre Exploration</h3>
            <p>Dive into your favourite genres or discover entirely new reading worlds.</p>
          </div>

          <div className="feature-card">
            <FaGlobe className="feature-icon" />
            <h3>Community Driven</h3>
            <p>Readers and recommenders help shape the library with diverse contributions.</p>
          </div>
        </div>
      </section>


      {/* CONTACT SECTION */}
      <section id="contact" className="landing-contact">
        <h2><FaEnvelope className="section-icon" /> Contact Us</h2>

        <p className="contact-subtitle">We’d love to hear from you.</p>

        {/* Contact Grid */}
        <div className="contact-grid">

          <div className="contact-card">
            <FaEnvelope className="contact-icon" />
            <h3>Email Us</h3>
            <p>Reach out anytime</p>
            <span>bookfinderstatuscode6@gmail.com</span>
          </div>

          <div className="contact-card">
            <FaPhoneAlt className="contact-icon" />
            <h3>Call Us</h3>
            <p>Mon - Sat, 9 AM to 6 PM</p>
            <span>+91 9876543210</span>
          </div>

          <div className="contact-card">
            <FaGlobe className="contact-icon" />
            <h3>Follow Us</h3>
            <p>Stay updated</p>
            <span>@BookFinderOfficial</span>
          </div>

        </div>
      </section>

      {/* WHY BOOKFINDER SECTION */}
      <section id="why" className="landing-why">
        <h2 className="section-title">
          Why <span>BookFinder?</span>
        </h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>📚 Smart Suggestions</h3>
            <p>Get personalized book recommendations based on your tastes and reading habits.</p>
          </div>

          <div className="why-card">
            <h3>⚡ Quick Search</h3>
            <p>Instantly search across thousands of titles, authors, and genres.</p>
          </div>

          <div className="why-card">
            <h3>🎯 Accurate Filters</h3>
            <p>Sort, compare, and explore books effortlessly with powerful filtering tools.</p>
          </div>
        </div>
      </section>



      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} BookFinder. All rights reserved.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#why">Why BookFinder</a>
        </div>
      </footer>



    </div>
  );
}

export default LandingPage;
