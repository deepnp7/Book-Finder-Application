using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        // Register user (BookRecommender / BookReader)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                MobileNumber = model.MobileNumber,
                Password = model.Password
            };

            var (status, message) = await _authService.Registration(user, model.UserRole);

            if (status == 0)
                return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }

        // Login user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (status, response) = await _authService.Login(model);

            if (status == 0)
                return Unauthorized(new { Message = response });

            return Ok(response);
        }
    }
}