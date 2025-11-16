import React, { useState, useEffect } from 'react';
import './BookReaderViewBook.css';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import BookReaderNavbar from './BookReaderNavbar';

const BookReaderViewBook = () => {
  // Input search text
  const [searchTerm, setSearchTerm] = useState('');

  // Full book list fetched from API
  const [books, setBooks] = useState([]);

  // Search filter type (title/author/genre/all)
  const [searchType, setSearchType] = useState("all");

  // Sorting type for dropdown
  const [sortType, setSortType] = useState("");

  // Fetch Books from Backend API
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}api/books`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      // Save API response
      setBooks(response.data);

    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Call API once when component loads
  useEffect(() => {
    fetchBooks();
  }, []);

  // Final Book List (Search Independent, Sort Independent)
  let finalBooks = books;

  // Apply Search Filter (Only when input typed)
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();

    finalBooks = books.filter(book => {
      // Filter by Title only
      if (searchType === "title") {
        return book.title.toLowerCase().includes(term);
      }
      // Filter by Author only
      if (searchType === "author") {
        return book.author.toLowerCase().includes(term);
      }
      // Filter by Genre only
      if (searchType === "genre") {
        return book.genre.toLowerCase().includes(term);
      }

      // Search across All fields
      return (
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term)
      );
    });
  }

  // Apply Sorting (Only if search box is empty)
  else if (sortType !== "") {
    finalBooks = [...books].sort((a, b) => {
      switch (sortType) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);

        case "author-asc":
          return a.author.localeCompare(b.author);
        case "author-desc":
          return b.author.localeCompare(a.author);

        case "date-asc":
          return new Date(a.publishedDate) - new Date(b.publishedDate);
        case "date-desc":
          return new Date(b.publishedDate) - new Date(a.publishedDate);

        default:
          return 0;
      }
    });
  }

  return (
    <div>
      {/* Top Navbar */}
      <BookReaderNavbar />

      <div className="view-books-container">
        <h2 className="heading">Available Books</h2>

        {/* Search Section */}
        <div className="search-container">

          {/* Search Textbox */}
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Type Dropdown */}
          <select
            className="search-dropdown"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">Search All</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        {/* Sort Section */}
        <select
          className="search-dropdown"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title (A → Z)</option>
          <option value="title-desc">Title (Z → A)</option>
          <option value="author-asc">Author (A → Z)</option>
          <option value="author-desc">Author (Z → A)</option>
          <option value="date-asc">Published Date (Old → New)</option>
          <option value="date-desc">Published Date (New → Old)</option>
        </select>

        {/* Books Table */}
        <table className="books-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Cover Image</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Genre</th>
            </tr>
          </thead>

          <tbody>
            {/* If books exist, display them */}
            {finalBooks.length > 0 ? (
              finalBooks.map((book, index) => (
                <tr key={book.bookId}>
                  <td>{index + 1}</td>

                  {/* Book Cover (Base64) */}
                  <td>
                    {book.coverImage ? (
                      <img
                        src={`data:image/jpeg;base64,${book.coverImage}`}
                        alt={book.title}
                        className="cover-img"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>

                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publishedDate}</td>
                  <td>{book.genre}</td>
                </tr>
              ))
            ) : (
              // No records message
              <tr>
                <td colSpan="6" className="no-records">Oops! No records Found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookReaderViewBook;
