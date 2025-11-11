using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    // Included as requested. Not currently required by the rest of the code,
    // but available if you want to switch to Identity later.
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(30)]
        public string Name { get; set; }
    }
}
