using dotnetapp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Data
{
    // DbContext that includes ASP.NET Identity tables + custom tables
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) // Pass options to IdentityDbContext
        {
        }

        // Custom Books table
        public DbSet<Book> Books { get; set; } 
        // Custom Users table (separate from Identity)
        public DbSet<User> Users { get; set; } 
    }
}
