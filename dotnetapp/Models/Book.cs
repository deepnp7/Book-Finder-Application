using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Genre { get; set; }

        public string PublishedDate { get; set; } // store as string as per spec

        public string CoverImage { get; set; } // store path or URL
    }
}
