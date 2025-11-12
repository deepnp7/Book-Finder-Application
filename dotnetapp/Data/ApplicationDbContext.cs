using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;

namespace dotnetapp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Define DbSets (tables)
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }

        // Optional: configure model properties and relationships
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique username
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

        }
    }
}

