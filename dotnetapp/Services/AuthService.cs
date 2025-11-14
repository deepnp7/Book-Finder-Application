using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        //Register new user
        public async Task<(int, string)> Registration(User model, string role)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (existingUser != null)
            {
                return (0, "User already exists");
            }

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                MobileNumber = model.MobileNumber,
                UserRole = role
            };

            // Hash the password before saving
            user.Password = _passwordHasher.HashPassword(user, model.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (1, "User registered successfully");
        }

        //Login existing user
        public async Task<(int, object)> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
            {
                return (0, "Invalid email");
            }

            // Verify hashed password
            var passwordResult = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);
            if (passwordResult == PasswordVerificationResult.Failed)
            {
                return (0, "Invalid password");
            }

            // Generate JWT token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = GenerateToken(claims);

            return (1, new { Status = "Success", Token = token });
        }

        //Generate JWT token
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JWT");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["ValidIssuer"],
                audience: jwtSettings["ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}