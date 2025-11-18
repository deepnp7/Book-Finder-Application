import React, { useEffect, useState } from "react";
import "./ViewBook.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import BookRecommenderNavbar from "./BookRecommenderNavbar";

// Component to view, edit, and delete books
const ViewBook = () => {
  // State to store all books fetched from API
  const [books, setBooks] = useState([]);
  // State to track which book is being edited
  const [editingBook, setEditingBook] = useState(null);
  // State for edit form data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    coverImage: "",
  });
  // State for validation errors
  const [errors, setErrors] = useState({});
  // State to show success modal after update
  const [showSuccess, setShowSuccess] = useState(false);

  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Background particles for UI effect
  const particles = Array.from({ length: 25 });

  const navigate = useNavigate();

  // Fetch books from API when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Open edit modal and populate form with selected book data
  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publishedDate: book.publishedDate,
      genre: book.genre,
      coverImage: book.coverImage,
    });
  };

  // Open delete confirmation modal
  const handleDeleteRequest = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  // Confirm delete and remove book from API and state
  const confirmDelete = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${API_BASE_URL}api/books/${bookToDelete.bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Remove deleted book from state
        setBooks(books.filter((b) => b.bookId !== bookToDelete.bookId));
        setShowDeleteConfirm(false);
        setBookToDelete(null);
      })
      .catch((err) => console.error(err));
  };

  // Handle input changes in edit form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate edit form fields
  const validate = () => {
    let temp = {};
    if (!formData.title.trim()) temp.title = "Title required";
    if (!formData.author.trim()) temp.author = "Author required";
    if (!formData.publishedDate) temp.publishedDate = "Date required";
    if (!formData.genre.trim()) temp.genre = "Genre required";
    if (!formData.coverImage) temp.coverImage = "Cover required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle book update (with or without new image)
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");

    // If new image uploaded, convert to Base64
    if (formData.coverImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const updatedBook = { ...formData, coverImage: base64 };

        try {
          await axios.put(
            `${API_BASE_URL}api/books/${editingBook.bookId}`,
            updatedBook,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Update book in state
          setBooks(
            books.map((b) =>
              b.bookId === editingBook.bookId ? { ...b, ...updatedBook } : b
            )
          );
          setEditingBook(null);
          setShowSuccess(true);
        } catch {
          alert("Update failed!");
        }
      };
      reader.readAsDataURL(formData.coverImage);
    } else {
      // No image change, update directly
      axios
        .put(`${API_BASE_URL}api/books/${editingBook.bookId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setBooks(
            books.map((b) =>
              b.bookId === editingBook.bookId ? { ...b, ...formData } : b
            )
          );
          setEditingBook(null);
          setShowSuccess(true);
        })
        .catch(() => alert("Update failed"));
    }
  };

  return (
    <div className="viewbook-container">
      {/* Navbar */}
      <BookRecommenderNavbar />

      {/* Background particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      <h2 className="page-title">My Book Shelf</h2>

      {/* Book cards grid */}
      <div className="book-card-grid">
        {books.length === 0 ? (
          <div className="no-books">No books found.</div>
        ) : (
          books.map((book) => (
            <div className="book-card" key={book.bookId}>
              {/* Book cover */}
              <img
                src={`data:image/jpeg;base64,${book.coverImage}`}
                className="book-cover"
                alt="Book Cover"
              />

              {/* Book details */}
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">By {book.author}</p>

                <div className="tags">
                  <span className="tag date">{book.publishedDate}</span>
                  <span className="tag genre">{book.genre}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRequest(book)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="delete-modal">
          <div className="delete-box">
            <h3>Delete this book?</h3>
            <p>This action cannot be undone.</p>

            <div className="delete-actions">
              <button className="confirm-delete" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingBook && (
        <div className="edit-modal">
          <div className="edit-content">
            <h3>Edit Book</h3>

            <form onSubmit={handleUpdate}>
              {/* Title */}
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && <p className="err">{errors.title}</p>}

              {/* Author */}
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
              {errors.author && <p className="err">{errors.author}</p>}

              {/* Published Date */}
              <label>Published Date</label>
              <input
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleInputChange}
              />
              {errors.publishedDate && (
                <p className="err">{errors.publishedDate}</p>
              )}

              {/* Genre */}
              <label>Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
              />
              {errors.genre && <p className="err">{errors.genre}</p>}

              {/* File upload */}
              <div className="file-input-wrapper">
                <label className="file-label">Cover Image</label>

                <label htmlFor="file-upload" className="custom-file-btn">
                  Choose File
                </label>

                <input
                  id="file-upload"
                  type="file"
                  className="file-input"
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.files[0] })
                  }
                />

                <span className="file-name">
                  {formData.coverImage?.name || "No file chosen"}
                </span>
              </div>

              {/* Buttons */}
              <div className="edit-buttons">
                <button className="save">Save</button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setEditingBook(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-box">
            <h3>Book updated successfully!</h3>
            <button className="close" onClick={() => setShowSuccess(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBook;