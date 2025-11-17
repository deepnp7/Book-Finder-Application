import React, { useState, useEffect } from 'react';
import './BookReaderViewBook.css';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import BookReaderNavbar from './BookReaderNavbar';




const BookReaderViewBook = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState("all");
  const [sortType, setSortType] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}api/books`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  let finalBooks = books;

  // SEARCH FILTER



  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();

    finalBooks = books.filter(book => {
      if (searchType === "title") return book.title.toLowerCase().includes(term);
      if (searchType === "author") return book.author.toLowerCase().includes(term);
      if (searchType === "genre") return book.genre.toLowerCase().includes(term);

      return (
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term)
      );
    });
  }
  // SORT (only if search is empty)



  else if (sortType !== "") {
    finalBooks = [...books].sort((a, b) => {
      switch (sortType) {
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "author-asc": return a.author.localeCompare(b.author);
        case "author-desc": return b.author.localeCompare(a.author);
        case "date-asc": return new Date(a.publishedDate) - new Date(b.publishedDate);
        case "date-desc": return new Date(b.publishedDate) - new Date(a.publishedDate);
        default: return 0;
      }
    });
  }



  return (
    <div className="reader-view-wrapper">

      <BookReaderNavbar />

      {/* Background particles */}



      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="particle-reader"
          style={{
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
            animationDelay: `${Math.random() * 4}s`
          }}
        />
      ))}

      <div className="view-books-container">

        <h2 className="heading">Explore Books</h2>






        {/* ================= SEARCH + FILTER + SORT (Clean Row) ================= */}





        <div className="search-sort-row">

          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

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
        </div>





        {/* ================= BOOK GRID ================= */}





        <div className="books-grid">
          {finalBooks.length > 0 ? (
            finalBooks.map((book) => (
              <div
                key={book.bookId}
                className="book-card"
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={
                    book.coverImage
                      ? `data:image/jpeg;base64,${book.coverImage}`
                      : "/placeholder.jpg"
                  }
                  alt={book.title}
                  className="book-cover"
                />

                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>

                  <div className="tags">
                    <span className="tag tag-green">{book.genre}</span>
                    <span className="tag tag-blue">{book.publishedDate}</span>
                  </div>

                  <p className="author-line">By {book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-records">Oops! No books found.</p>
          )}
        </div>





        {/* ================= MODAL ================= */}




        {selectedBook && (
          <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-btn" onClick={() => setSelectedBook(null)}>
                ×
              </span>

              <img
                src={
                  selectedBook.coverImage
                    ? `data:image/jpeg;base64,${selectedBook.coverImage}`
                    : "/placeholder.jpg"
                }
                alt={selectedBook.title}
                className="modal-cover"
              />

              <h2 className="modal-title">{selectedBook.title}</h2>

              <div className="modal-tags">
                <span className="tag tag-green">{selectedBook.genre}</span>
                <span className="tag tag-blue">{selectedBook.publishedDate}</span>
              </div>

              <p className="modal-author"><strong>Author:</strong> {selectedBook.author}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};





export default BookReaderViewBook;
