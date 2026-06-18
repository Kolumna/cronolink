namespace Cronolink.Core.DTOs;

public record UserDto(Guid Id, string Email);
public record CreateUserRequest(string? FirstName, string? LastName, string Email, string Password);
public record LoginUserRequest(string Email, string Password);
public record UpdateUserRequest(string? FirstName, string? LastName, string Email, string PasswordHash);
public record AuthResponse(string Token);