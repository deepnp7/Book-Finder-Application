import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css";
import API_BASE_URL from "../apiConfig";
import BookRecommenderNavbar from "./BookRecommenderNavbar";
import { useNavigate } from "react-router-dom";

// Component for adding a new book
const BookForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    coverImage: null,
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for image preview
  const [previewImage, setPreviewImage] = useState(null);
  // State to control success modal visibility
  const [showModal, setShowModal] = useState(false);

  // React Router hook for navigation
  const navigate = useNavigate();

  // Array for generating background particles
  const particles = Array.from({ length: 25 });

  // Remove error for a specific field when corrected
  const removeError = (field) => {
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  };

  // Handle input changes (text and file)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      // If file is selected, update coverImage and preview
      setFormData({ ...formData, coverImage: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
      removeError("coverImage");
    } else {
      // Update text fields
      setFormData({ ...formData, [name]: value });
      if (value.trim() !== "") removeError(name);
    }
  };

  // Validate form fields before submission
  const validate = () => {
    let temp = {};
    if (!formData.title.trim()) temp.title = "Title is required";
    if (!formData.author.trim()) temp.author = "Author is required";
    if (!formData.publishedDate.trim()) temp.publishedDate = "Published date is required";
    if (!formData.genre.trim()) temp.genre = "Genre is required";
    if (!formData.coverImage) temp.coverImage = "Cover image is required";

    setErrors(temp);
    return Object.keys(temp).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails

    // Convert image file to Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];

      // Prepare payload for API
      const payload = {
        title: formData.title,
        author: formData.author,
        publishedDate: formData.publishedDate,
        genre: formData.genre,
        coverImage: base64String,
      };

      try {
        // Get token from local storage for authentication
        const token = localStorage.getItem("token");

        // Send POST request to API
        await axios.post(`${API_BASE_URL}api/books`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Show success modal
        setShowModal(true);
      } catch (err) {
        alert("Something went wrong uploading the book.");
      }
    };

    reader.readAsDataURL(formData.coverImage); // Read image file
  };

  // Close modal and navigate to book view page
  const closeModal = () => {
    setShowModal(false);
    navigate("/bookrecommender/view");
  };

  return (
    <>
      {/* Navbar at the top */}
      <BookRecommenderNavbar />

      {/* Background with animated particles */}
      <div className="bookform-background">
        {particles.map((_, i) => (
          <div
            className="particle"
            key={i}
            style={{
              left: Math.random() * 100 + "vw",
              top: Math.random() * 100 + "vh",
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Centered form card */}
        <div className="bookform-wrapper">
          <div className="bookform-card">
            <h2 className="bookform-title">Add a New Book</h2>

            {/* Form for book details */}
            <form className="bookform-form" onSubmit={handleSubmit}>
              {/* Title input */}
              <div className="floating-group">
                <input
                  type="text"
                  name="title"
                  placeholder=" "
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <label>Book Title</label>
                {errors.title && <p className="error">{errors.title}</p>}
              </div>

              {/* Author input */}
              <div className="floating-group">
                <input
                  type="text"
                  name="author"
                  placeholder=" "
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
                <label>Author</label>
                {errors.author && <p className="error">{errors.author}</p>}
              </div>

              {/* Published date input */}
              <div className="floating-group">
                <input
                  type="date"
                  name="publishedDate"
                  placeholder=" "
                  value={formData.publishedDate}
                  onChange={handleChange}
                  required
                />
                <label>Published Date</label>
                {errors.publishedDate && (
                  <p className="error">{errors.publishedDate}</p>
                )}
              </div>

              {/* Genre input */}
              <div className="floating-group">
                <input
                  type="text"
                  name="genre"
                  placeholder=" "
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
                <label>Genre</label>
                {errors.genre && <p className="error">{errors.genre}</p>}
              </div>

              {/* File upload for cover image */}
              <div className="file-group">
                <label className="file-label">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleChange} />

                {errors.coverImage && <p className="error">{errors.coverImage}</p>}

                {/* Preview selected image */}
                {previewImage && (
                  <div className="preview-box">
                    <img src={previewImage} alt="Preview" />
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button className="bookform-btn">Add Book</button>
            </form>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book Added Successfully 🎉</h3>
            <p>Your book has been uploaded.</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookForm;