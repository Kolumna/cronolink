using Cronolink.Core.Models;

namespace Cronolink.Core.DTOs;

public record UserDto(Guid Id, string Email, string? FirstName, string? LastName, UserRole Role, DateTime UpdatedAt, DateTime CreatedAt);
public record CreateUserRequest(string? FirstName, string? LastName, string Email, string Password);
public record UpdateUserRequest(string? FirstName, string? LastName, string Email, string PasswordHash);