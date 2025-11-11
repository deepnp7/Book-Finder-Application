using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using dotnetapp.Models;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthenticationController(IAuthService auth)
        {
            _auth = auth;
        }

        // POST: /api/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var (status, result) = await _auth.Login(model);

                if (status == 201)
                    return Ok(result); // { Status: "Success", token: ... }

                // 400 with error string
                return BadRequest(new { Error = result });
            }
            catch (Exception ex)
            {
                // per spec return 500 with error message
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // POST: /api/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // model.UserRole expected to be provided by request body
                var role = model.UserRole;
                var (status, message) = await _auth.Registration(model, role);

                if (status == 201)
                    return StatusCode(201, new { Message = message });

                return BadRequest(new { Error = message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
