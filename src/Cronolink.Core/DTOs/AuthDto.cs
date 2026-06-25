namespace Cronolink.Core.DTOs;

public record LoginUserRequest(string Email, string Password);
public record RefreshTokenRequest(string RefreshToken);
public record AuthResponse(string Token, string RefreshToken, bool MustChangePassword, bool IsProfileComplete, DateTime TokenExpiration);