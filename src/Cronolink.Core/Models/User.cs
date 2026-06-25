namespace Cronolink.Core.Models;

public enum UserRole
{
  User,
  Admin
}

public class User
{
  public Guid Id { get; set; }
  public string? FirstName { get; set; } = null;
  public string? LastName { get; set; } = null;
  public required string Email { get; set; }
  public required string PasswordHash { get; set; }
  public UserRole Role { get; set; } = UserRole.User;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public bool MustChangePassword { get; set; }
  public bool IsProfileComplete { get; set; }
}