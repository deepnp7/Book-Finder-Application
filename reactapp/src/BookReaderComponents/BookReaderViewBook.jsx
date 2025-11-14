import React, { useState, useEffect } from 'react';
import './BookReaderViewBook.css';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import BookReaderNavbar from './BookReaderNavbar';

const BookReaderViewBook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token'); // Replace with actual token
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
  }, [])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <BookReaderNavbar />
      <div className="view-books-container">
        <h2 className="heading">Available Books</h2>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <tr key={book.bookId}>
                  <td>{index + 1}</td>
                  <td>{book.coverImage ? (<img

                    src={`data:image/jpeg;base64, ${book.coverImage}`}

                    alt={book.title}

                    className="cover-img"

                  />) : (<span>No image</span>)}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publishedDate}</td>
                  <td>{book.genre}</td>
                </tr>
              ))
            ) : (
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
