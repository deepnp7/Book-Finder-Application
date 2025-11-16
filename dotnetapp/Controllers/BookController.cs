using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Models;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController] // Enables automatic validation & binding behavior

    [Route("api/books")] // Base route for all book APIs
    public class BookController : ControllerBase
    {
        // Injected service layer
        private readonly BookService _service; 

        public BookController(BookService service)
        {
            // Assign service instance
            _service = service; 
        }

        // GET: api/books
        [HttpGet]

        [Authorize] // Only authenticated users can access
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            
                // Fetching all books
                var books = await _service.GetAllBooks(); 
                return Ok(books);
            
            
        }

        // GET: api/books/{bookId}
        [HttpGet("{bookId:int}")]
        [Authorize]
        public async Task<ActionResult<Book>> GetBookById(int bookId)
        {
            
                // Fetch single book by ID
                var book = await _service.GetBookById(bookId); 
                return Ok(book);
            
        }

        // POST: api/books
        [HttpPost]

        [Authorize(Roles = "BookRecommender")] // Only recommenders can add books
        public async Task<ActionResult> AddBook([FromBody] Book book)
        {
            
                // Validate request body
                if (!ModelState.IsValid) 
                    return BadRequest(ModelState);

                // Add book to DB
                var result = await _service.AddBook(book); 
                if (result)
                    return StatusCode(201, new { Message = "Book added successfully" });

                return StatusCode(500, new { Message = "Failed to add book" });
            
        }

        // PUT: api/books/{bookId}
        [HttpPut("{bookId:int}")]

        [Authorize(Roles = "BookRecommender")] // Only recommenders can update
        public async Task<ActionResult> UpdateBook(int bookId, [FromBody] Book book)
        {
            
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Update book details
                var updated = await _service.UpdateBook(bookId, book); 
                if (updated)
                    return Ok(new { Message = "Book updated successfully" });

                return NotFound(new { Message = "Cannot find any book" });
            
        }

        // DELETE: api/books/{bookId}
        [HttpDelete("{bookId:int}")]

        [Authorize(Roles = "BookRecommender")] // Only recommenders can delete
        public async Task<ActionResult> DeleteBook(int bookId)
        {
            
                // Remove book from DB
                var deleted = await _service.DeleteBook(bookId); 
                if (deleted)
                    return Ok(new { Message = "Book deleted successfully" });

                return NotFound(new { Message = "Cannot find any book" });
            

            
        }
    }
}
