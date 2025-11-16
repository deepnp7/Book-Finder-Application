import React, { useEffect, useState } from "react";
import "./ViewBook.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import BookRecommenderNavbar from "./BookRecommenderNavbar";

const ViewBook = () => {
  // State to store list of books
  const [books, setBooks] = useState([]);

  // Stores the book being edited
  const [editingBook, setEditingBook] = useState(null);

  // Controlled form state for edit modal
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    genre: "",
    coverImage: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Show success modal when update completes
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // Fetch all books on page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${API_BASE_URL}api/books`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // When user clicks Edit button
  const handleEdit = (book) => {
    setEditingBook(book);

    // Fill form fields with existing book data
    setFormData({
      title: book.title,
      author: book.author,
      publishedDate: book.publishedDate,
      genre: book.genre,
      coverImage: book.coverImage,
    });
  };

  // Delete selected book
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const token = localStorage.getItem("token");

      axios.delete(`${API_BASE_URL}api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          // Remove deleted book from UI
          setBooks(books.filter((b) => b.bookId !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation before save/update
  const validate = () => {
    let tempErrors = {};

    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.author.trim()) tempErrors.author = "Author is required.";
    if (!formData.publishedDate)
      tempErrors.publishedDate = "Publication date is required.";
    if (!formData.genre.trim()) tempErrors.genre = "Genre is required.";
    if (!formData.coverImage)
      tempErrors.coverImage = "Cover image is required.";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  // Submit updated book info
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");

    // Case 1: User uploaded a NEW image file
    if (formData.coverImage instanceof File) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];

        const updatedBook = {
          title: formData.title,
          author: formData.author,
          publishedDate: formData.publishedDate,
          genre: formData.genre,
          coverImage: base64String,
        };

        try {
          // Send update request
          await axios.put(
            `${API_BASE_URL}api/books/${editingBook.bookId}`,
            updatedBook,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Update UI list
          const updatedBooks = books.map((b) =>
            b.bookId === editingBook.bookId ? { ...b, ...updatedBook } : b
          );

          setBooks(updatedBooks);
          setEditingBook(null);
          setShowSuccess(true);
        } catch (error) {
          console.error("Error updating book:", error);
          alert("Failed to update book!");
        }
      };

      reader.readAsDataURL(formData.coverImage);
    }

    // Case 2: User did NOT change the image
    else {
      const updatedBook = { ...formData };

      axios.put(`${API_BASE_URL}api/books/${editingBook.bookId}`, updatedBook, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          const updatedBooks = books.map((b) =>
            b.bookId === editingBook.bookId ? { ...b, ...updatedBook } : b
          );

          setBooks(updatedBooks);
          setEditingBook(null);
          setShowSuccess(true);
        })
        .catch((err) => {
          console.error("Error updating book:", err);
          alert("Failed to update book!");
        });
    }
  };

  // Close update success modal
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/bookrecommender/view");
  };

  return (
    <div className="viewbook-container">
      {/* Navigation bar */}
      <BookRecommenderNavbar />

      <h2>Books</h2>

      {/* Book Table */}
      <table className="book-table">
        <thead>
          <tr>
            <th>Cover Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Date</th>
            <th>Genre</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* No Records */}
          {books.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-records">
                Oops! No records found.
              </td>
            </tr>
          ) : (
            // Render all book rows
            books.map((book) => (
              <tr key={book.bookId}>
                <td>
                  <img
                    src={`data:image/jpeg;base64,${book.coverImage}`}
                    alt={book.title}
                    className="book-cover"
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishedDate}</td>
                <td>{book.genre}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>

                  <button className="delete-btn" onClick={() => handleDelete(book.bookId)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingBook && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Book</h3>

            <form onSubmit={handleUpdate}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && <p className="error">{errors.title}</p>}

              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
              {errors.author && <p className="error">{errors.author}</p>}

              <label>Publication Date:</label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publishedDate}
                onChange={handleInputChange}
              />
              {errors.publishedDate && <p className="error">{errors.publishedDate}</p>}

              <label>Genre:</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
              />
              {errors.genre && <p className="error">{errors.genre}</p>}

              <label>Cover Image URL:</label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.files[0] })}
              />
              {errors.coverImage && <p className="error">{errors.coverImage}</p>}

              <div className="edit-btn-group">
                <button type="submit" className="save-btn">Save Changes</button>

                <button type="button" className="cancel-btn" onClick={() => setEditingBook(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-content">
            <h3>Book Updated Successfully!</h3>

            <button className="close-btn" onClick={handleCloseSuccess}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBook;
