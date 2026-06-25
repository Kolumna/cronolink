using Cronolink.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Cronolink.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
       {
           e.ToTable("users");
           e.Property(p => p.FirstName).HasMaxLength(100);
           e.Property(p => p.LastName).HasMaxLength(100);
           e.Property(p => p.Email).HasMaxLength(200).IsRequired();
           e.Property(p => p.PasswordHash).HasMaxLength(200).IsRequired();
           e.Property(p => p.Role).HasDefaultValue(UserRole.User);
           e.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
           e.Property(p => p.UpdatedAt).HasDefaultValueSql("now()");
       });
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("projects");
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Description).HasMaxLength(1000);
            e.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
            e.Property(p => p.UpdatedAt).HasDefaultValueSql("now()");
        });
        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.ToTable("refresh_tokens");
            e.Property(p => p.TokenHash).HasMaxLength(200).IsRequired();
            e.Property(p => p.IsRevoked).HasDefaultValue(false);
            e.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
            e.Property(p => p.UpdatedAt).HasDefaultValueSql("now()");
        });
    }
}