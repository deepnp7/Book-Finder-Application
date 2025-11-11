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

        [HttpGet]
        [Authorize] // role-based
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
                return NotFound(new { Message = "Book not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "BookRecommender")]
        //  [AllowAnonymous]
        public async Task<ActionResult> AddBook([FromBody] Book book)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.AddBook(book);
                if (result)
                    return StatusCode(201, new { Message = "Book added successfully" });

                return StatusCode(500, new { Message = "Failed to add book" });
            }
            catch (BookException)
            {
                return StatusCode(500, new { Message = "Failed to add book" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

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

                return NotFound(new { Message = "Cannot find any book" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

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
