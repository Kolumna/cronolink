using Cronolink.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Cronolink.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("projects");
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
        });
    }
}