using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class BookException : Exception
    {
        public BookException(string message) : base(message) { }
    }
    public class BookService
    {
        private readonly ApplicationDbContext _context;
        public BookService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAllBooks()
        {
            return await _context.Books.AsNoTracking().ToListAsync();
        }

        public async Task<Book> GetBookById(int bookId)
        {
            var book = await _context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.BookId == bookId);
            if (book == null)
                throw new BookException("Cannot find any book");
            return book;
        }

        public async Task<bool> AddBook(Book book)
        {
            var exists = await _context.Books.AnyAsync(b => b.Title == book.Title);
            if (exists)
                throw new BookException("Failed to add book");

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBook(int bookId, Book book)
        {
            var existing = await _context.Books.FirstOrDefaultAsync(b => b.BookId == bookId);
            if (existing == null) return false;

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Genre = book.Genre;
            existing.PublishedDate = book.PublishedDate;
            existing.CoverImage = book.CoverImage;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBook(int bookId)
        {
            var existing = await _context.Books.FirstOrDefaultAsync(b => b.BookId == bookId);
            if (existing == null) return false;

            _context.Books.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
