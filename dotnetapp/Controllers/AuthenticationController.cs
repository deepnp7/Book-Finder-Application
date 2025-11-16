using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{

    [ApiController] // Enables automatic model validation and binding behavior

    [Route("api")] // Base route for the controller
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService; // Injected authentication service
        private readonly EmailService _emailService; // Injected email service
        private readonly ApplicationDbContext _context; // Injected db context
        private readonly UserManager<ApplicationUser> _userManager;


        public AuthenticationController(IAuthService authService, EmailService emailService, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _authService = authService;
            _emailService = emailService;
            _context = context;
            _userManager = userManager;
        }

        // POST method for regitering details: api/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (!ModelState.IsValid) // Check for validation errors
                return BadRequest(ModelState);

            // organizational email validation 
            var allowedDomains = new[] { "@gmail.com", "@outlook.com" };

            if (!allowedDomains.Any(d => model.Email.EndsWith(d, StringComparison.OrdinalIgnoreCase)))
                return BadRequest(new { Message = "Please use your official organizational email address." });



            // Create user object to pass to the service
            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                MobileNumber = model.MobileNumber,
                Password = model.Password
            };

            // Call service method for registration
            var (status, message) = await _authService.Registration(user, model.UserRole);

            // Registration failed
            if (status == 0)
                return BadRequest(new { Message = message });


            //role based email body
            string emailBody = "";

            if (model.UserRole == "BookRecommender")
            {
                emailBody =
                    $"Hi {model.Username},\n\n" +
                    "Welcome to Book Finder!\n" +
                    "You have registered successfully as a **BOOK RECOMMENDER**.\n" +
                    "You can now add, update, and manage book recommendations.\n\n" +
                    "Happy recommending!";
            }
            else if (model.UserRole == "BookReader")
            {
                emailBody =
                    $"Hi {model.Username},\n\n" +
                    "Welcome to Book Finder!\n" +
                    "You have registered successfully as a **BOOK READER**.\n" +
                    "You can now explore book recommendations and read collections.\n\n" +
                    "Happy reading!";
            }
            else
            {
                // default fallback
                emailBody =
                    $"Hi {model.Username},\n\n" +
                    "Your account has been registered successfully.\n\n" +
                    "Thank you!";
            }

            // sending success email
            await _emailService.SendEmailAsync(
                model.Email,
                "Registration Successful",
                emailBody
            );

            return Ok(new { Message = message }); // Success response
        }

        // POST method for login details: api/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Validate model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Attempt login via servicew   
            var (status, response) = await _authService.Login(model);

            //if Login fails
            if (status == 0)
                return Unauthorized(new { Message = response });

            // Return token and user details
            return Ok(response);
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return BadRequest(new { Message = "No user found with this email." });

            // Generate OTP
            string otp = new Random().Next(100000, 999999).ToString();

            user.ResetOtp = otp;
            user.OtpExpiryTime = DateTime.Now.AddMinutes(10);

            await _context.SaveChangesAsync();

            // Send OTP email
            await _emailService.SendEmailAsync(
                model.Email,
                "Password Reset OTP",
                $"Your OTP for resetting your password is: {otp}.\nThis OTP will expire in 10 minutes."
            );

            return Ok(new { Message = "OTP sent to your email." });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return BadRequest(new { Message = "User not found." });

            if (user.ResetOtp != model.Otp)
                return BadRequest(new { Message = "Invalid OTP." });

            if (user.OtpExpiryTime < DateTime.Now)
                return BadRequest(new { Message = "OTP expired." });

            return Ok(new { Message = "OTP verified successfully." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var identityUser = await _userManager.FindByEmailAsync(model.Email);
            var customUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (identityUser == null || customUser == null)
                return BadRequest(new { Message = "User not found." });

            // Validate OTP
            if (customUser.ResetOtp != model.Otp)
                return BadRequest(new { Message = "Invalid OTP." });

            if (customUser.OtpExpiryTime < DateTime.Now)
                return BadRequest(new { Message = "OTP expired." });

            // Identity password reset
            var token = await _userManager.GeneratePasswordResetTokenAsync(identityUser);
            var result = await _userManager.ResetPasswordAsync(identityUser, token, model.NewPassword);

            if (!result.Succeeded)
                return BadRequest(new { Message = "Password reset failed.", Errors = result.Errors });

            // Update custom user table
            var hasher = new PasswordHasher<User>();
            customUser.Password = hasher.HashPassword(customUser, model.NewPassword);

            // Clear OTP
            customUser.ResetOtp = null;
            customUser.OtpExpiryTime = null;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Password reset successful." });
        }

    }
}
