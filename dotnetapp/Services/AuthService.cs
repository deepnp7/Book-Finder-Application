using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        // Identity user handler
        private readonly UserManager<ApplicationUser> _userManager;   
        // Identity role handler
        private readonly RoleManager<IdentityRole> _roleManager;       
        // For JWT config
        private readonly IConfiguration _configuration;                
        // Custom DB context
        private readonly ApplicationDbContext _context;                

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        // Register a new user
        public async Task<(int, string)> Registration(User model, string role)
        {
            // Check existing Identity user
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return (0, "User already exists");

            // Create Identity user object
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.MobileNumber,
                Name = model.Username
            };

            // Create user in Identity tables
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return (0, string.Join(", ", result.Errors.Select(e => e.Description))); // Return identity errors with message

            // Ensure role exists in Identity
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));

            // Assign user role
            await _userManager.AddToRoleAsync(user, role);

            // Hash password for custom Users table
            var hasher = new PasswordHasher<User>();

            model.Password = hasher.HashPassword(model, model.Password);

            model.UserRole = role; // Ensure custom table stores correct role

            // Save user to your custom Users table
            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return (1, "User registered successfully");
        }

        // Login user and return JWT token
        public async Task<(int, object)> Login(LoginModel model)
        {
            // Find identity user by email
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return (0, "Invalid email or password");

            // Verify password using Identity
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
                return (0, "Invalid email or password");

            // Get assigned roles
            var userRoles = await _userManager.GetRolesAsync(user);

            // Create claims for JWT
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("username", user.Name), // Custom claim
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
            foreach (var role in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, role));

            // Generate token
            var token = GenerateJwtToken(authClaims);

            return (1, new { Status = "Success", Token = token });
        }

        // Generate JWT using claims
        private string GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JWT");

            // Create signing key
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Secret"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create token object
            var token = new JwtSecurityToken(
                issuer: jwtSettings["ValidIssuer"],
                audience: jwtSettings["ValidAudience"],
                expires: DateTime.Now.AddHours(2), // Token expiry
                claims: claims,
                signingCredentials: creds
            );

            // Return token string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
