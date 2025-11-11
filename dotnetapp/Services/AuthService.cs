using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 1. Registration
        // returns (statusCode, message)
        public async Task<(int, string)> Registration(User model, string role)
        {
            // Basic duplicate check
            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existing != null)
                return (400, "Email already registered");

            // hash the password (simple SHA256 for demo; replace with a stronger hash in prod)
            var hashed = HashPassword(model.Password);

            var user = new User
            {
                Email = model.Email,
                Password = hashed,
                Username = model.Username,
                MobileNumber = model.MobileNumber,
                UserRole = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (201, "User registered successfully");
        }

        // 2. Login
        // returns (statusCode, object) where object can be a string message or token payload
        public async Task<(int, object)> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return (400, "Invalid email");
            }

            var hashed = HashPassword(model.Password);
            if (user.Password != hashed)
            {
                return (400, "Invalid password");
            }

            // create claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username ?? user.Email),
                new Claim(ClaimTypes.Role, user.UserRole ?? string.Empty)
            };

            var token = GenerateToken(claims);

            var payload = new
            {
                Status = "Success",
                token = token
            };

            return (201, payload);
        }

        // 3. GenerateToken
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var expireMinutesStr = _config["Jwt:ExpiryMinutes"];
            int expiryMinutes = 60;
            if (!string.IsNullOrEmpty(expireMinutesStr) && int.TryParse(expireMinutesStr, out var parsed))
                expiryMinutes = parsed;

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // helper hashing (simple deterministic hash for checking)
        private static string HashPassword(string password)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
