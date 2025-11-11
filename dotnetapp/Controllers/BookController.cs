using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Models;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BookController : ControllerBase
    {
        private readonly BookService _service;

        public BookController(BookService service)
        {
            _service = service;
        }

        // 1. GetAllBooks - accessible to authenticated users (both roles)
        [HttpGet]
        [Authorize] // both BookRecommender and BookReader (role-based check not needed here)
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            try
            {
                var books = await _service.GetAllBooks();
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // 2. GetBookById
        [HttpGet("{bookId:int}")]
        [Authorize]
        public async Task<ActionResult<Book>> GetBookById(int bookId)
        {
            try
            {
                var book = await _service.GetBookById(bookId);
                return Ok(book);
            }
            catch (BookException)
            {
                // per spec: If book not found => 404 Not Found with "Book not found"
                return NotFound(new { Message = "Book not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // 3. AddBook - only BookRecommender role allowed
        [HttpPost]
        [Authorize(Roles = "BookRecommender")]
        public async Task<ActionResult> AddBook([FromBody] Book book)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.AddBook(book);
                if (result)
                    return StatusCode(201, new { Message = "Book added successfully" });

                // if service returns false (it does not in current implementation), fallback
                return StatusCode(500, new { Message = "Failed to add book" });
            }
            catch (BookException)
            {
                // per spec: when duplicate -> return 500 with "Failed to add book"
                return StatusCode(500, new { Message = "Failed to add book" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // 4. UpdateBook
        [HttpPut("{bookId:int}")]
        [Authorize(Roles = "BookRecommender")]
        public async Task<ActionResult> UpdateBook(int bookId, [FromBody] Book book)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _service.UpdateBook(bookId, book);
                if (updated)
                    return Ok(new { Message = "Book updated successfully" });

                // if not found, per spec return 404 with "Cannot find any book"
                return NotFound(new { Message = "Cannot find any book" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // 5. DeleteBook
        [HttpDelete("{bookId:int}")]
        [Authorize(Roles = "BookRecommender")]
        public async Task<ActionResult> DeleteBook(int bookId)
        {
            try
            {
                var deleted = await _service.DeleteBook(bookId);
                if (deleted)
                    return Ok(new { Message = "Book deleted successfully" });

                return NotFound(new { Message = "Cannot find any book" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
