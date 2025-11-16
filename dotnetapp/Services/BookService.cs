using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    // Custom exception for book-related errors
    public class BookException : Exception
    {
        public BookException(string message) : base(message) { }
    }

    public class BookService
    {

        private readonly ApplicationDbContext _context; 

        public BookService(ApplicationDbContext context)
        {
            // Inject context
            _context = context; 

        }

        // Fetch all books
        public async Task<IEnumerable<Book>> GetAllBooks()
        {
            return await _context.Books
                .AsNoTracking()              // Improve performance (read-only)
                .ToListAsync();
        }

        // Fetch a single book by ID
        public async Task<Book> GetBookById(int bookId)
        {
            var book = await _context.Books
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.BookId == bookId);

            if (book == null)
                throw new BookException("Cannot find any book"); // Custom error

            return book;
        }

        // Add a new book
        public async Task<bool> AddBook(Book book)
        {
            // Prevent duplicate titles
            var exists = await _context.Books.AnyAsync(b => b.Title == book.Title);
            if (exists)
                throw new BookException("Failed to add book");

            // Add to DB
            _context.Books.Add(book);       
            await _context.SaveChangesAsync();
            return true;
        }

        // Update an existing book
        public async Task<bool> UpdateBook(int bookId, Book book)
        {
            var existing = await _context.Books.FirstOrDefaultAsync(b => b.BookId == bookId);
            if (existing == null) return false; // Book not found

            // Update fields
            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Genre = book.Genre;
            existing.PublishedDate = book.PublishedDate;
            existing.CoverImage = book.CoverImage;

            await _context.SaveChangesAsync();
            return true;
        }

        // Delete a book
        public async Task<bool> DeleteBook(int bookId)
        {
            var existing = await _context.Books.FirstOrDefaultAsync(b => b.BookId == bookId);
            if (existing == null) return false;

            // Remove from DB
            _context.Books.Remove(existing); 
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
