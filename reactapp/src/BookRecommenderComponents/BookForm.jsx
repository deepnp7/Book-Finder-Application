
import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css";
import API_BASE_URL from "../apiConfig";
import BookRecommenderNavbar from "./BookRecommenderNavbar";
import { useNavigate } from "react-router-dom";


const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    coverImage: null,
  });


  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const particles = Array.from({ length: 25 });

  const removeError = (field) => {
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, coverImage: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
      removeError("coverImage");
    } else {
      setFormData({ ...formData, [name]: value });
      if (value.trim() !== "") removeError(name);
    }
  };


  const validate = () => {
    let temp = {};
    if (!formData.title.trim()) temp.title = "Title is required";
    if (!formData.author.trim()) temp.author = "Author is required";
    if (!formData.publishedDate.trim()) temp.publishedDate = "Published date is required";
    if (!formData.genre.trim()) temp.genre = "Genre is required";
    if (!formData.coverImage) temp.coverImage = "Cover image is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];

      const payload = {
        title: formData.title,
        author: formData.author,
        publishedDate: formData.publishedDate,
        genre: formData.genre,
        coverImage: base64String,
      };

      try {
        const token = localStorage.getItem("token");

        await axios.post(`${API_BASE_URL}api/books`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setShowModal(true);
      } catch (err) {
        alert("Something went wrong uploading the book.");
      }
    };

    reader.readAsDataURL(formData.coverImage);
  };


  const closeModal = () => {
    setShowModal(false);
    navigate("/bookrecommender/view");
  };


  return (
    <>
      {/* NAVBAR ALWAYS AT TOP */}
      <BookRecommenderNavbar />

      {/* PAGE BACKGROUND WITH PARTICLES */}
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

        {/* CENTERED FORM */}
        <div className="bookform-wrapper">
          <div className="bookform-card">
            <h2 className="bookform-title">Add a New Book</h2>

            <form className="bookform-form" onSubmit={handleSubmit}>
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

              <div className="file-group">
                <label className="file-label">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleChange} />

                {errors.coverImage && <p className="error">{errors.coverImage}</p>}

                {previewImage && (
                  <div className="preview-box">
                    <img src={previewImage} alt="Preview" />
                  </div>
                )}
              </div>

              <button className="bookform-btn">Add Book</button>
            </form>
          </div>
        </div>
      </div>

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
