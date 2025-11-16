
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string MobileNumber { get; set; }

        [Required]
        public string UserRole { get; set; } // "BookRecommender" or "BookReader"
        public string? ResetOtp { get; set; }
        public DateTime? OtpExpiryTime { get; set; }

    }
}

