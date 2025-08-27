using Microsoft.EntityFrameworkCore;
using NoteWithJWT.Models.DomainModels;

namespace NoteWithJWT.Data
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions options) : base(options)
        {
            
        }
        public DbSet<Note> Notes { get; set; }
    }
}
