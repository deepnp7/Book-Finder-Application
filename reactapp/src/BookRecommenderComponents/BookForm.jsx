import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css";
import API_BASE_URL from "../apiConfig";
import BookRecommenderNavbar from "./BookRecommenderNavbar";
import { useNavigate } from "react-router-dom";

const BookForm = () => {

  // Stores all form field values
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    coverImage: null,
  });

  // Stores validation error messages
  const [errors, setErrors] = useState({});

  // Controls success modal visibility
  const [showModal, setShowModal] = useState(false);

  // Loading indicator for API call
  const [loading, setLoading] = useState(false);

  // Stores preview URL of uploaded image
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  // Handle Input change (Text + File Upload)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If input is file type
    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      // Generate image preview for UI
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      // Normal text-based input
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.author.trim()) newErrors.author = "Author is required.";
    if (!formData.publishedDate.trim())
      newErrors.publishedDate = "Published date is required.";
    if (!formData.genre.trim()) newErrors.genre = "Genre is required.";
    if (!formData.coverImage) newErrors.coverImage = "Cover Image is required.";

    return newErrors;
  };

  // Submit Form → Validate → Convert Image → API Call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Stop submission if errors exist
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      try {
        // Convert image file to Base64
        const reader = new FileReader();

        reader.onloadend = async () => {
          // Remove "data:image/png;base64," prefix
          const base64String = reader.result.split(",")[1];

          // Prepare final object for backend
          const bookData = {
            title: formData.title,
            author: formData.author,
            publishedDate: formData.publishedDate,
            genre: formData.genre,
            coverImage: base64String,
          };

          const token = localStorage.getItem("token");

          try {
            // POST Request to Add Book
            const response = await axios.post(
              `${API_BASE_URL}api/books`,
              bookData,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Show success popup
            setShowModal(true);

            // Reset form fields
            setFormData({
              title: "",
              author: "",
              publishedDate: "",
              genre: "",
              coverImage: null,
            });
            setPreviewImage(null); // Clear preview
          } catch (error) {
            console.error("Error adding book:", error);
            alert("Something went wrong while adding the book!");
          } finally {
            setLoading(false);
          }
        };

        reader.readAsDataURL(formData.coverImage);

      } catch (error) {
        console.error("Error preparing file:", error);
        alert("Something went wrong while reading the file!");
        setLoading(false);
      }
    }
  };

  // Close Success Modal → Navigate To ViewBook Page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/bookrecommender/view");
  };

  return (
    <div className="addbook-container">

      {/* Top Navigation Bar */}
      <BookRecommenderNavbar />

      {/* Create Book Form Section */}
      <div className="form-section">
        <h2>Create New Book</h2>

        <form onSubmit={handleSubmit} className="book-form">

          {/* Title */}
          <div className="form-group">
            <label>
              Title<span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>

          {/* Author */}
          <div className="form-group">
            <label>
              Author<span className="required">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
            {errors.author && <p className="error">{errors.author}</p>}
          </div>

          {/* Published Date */}
          <div className="form-group">
            <label>
              Published Date<span className="required">*</span>
            </label>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
            />
            {errors.publishedDate && (
              <p className="error">{errors.publishedDate}</p>
            )}
          </div>

          {/* Genre */}
          <div className="form-group">
            <label>
              Genre<span className="required">*</span>
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            />
            {errors.genre && <p className="error">{errors.genre}</p>}
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label>
              Cover Page<span className="required">*</span>
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
            />
            {errors.coverImage && <p className="error">{errors.coverImage}</p>}

            {/* Preview Image */}
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Cover Preview" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Book added successfully!</h3>

            <button className="close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookForm;
