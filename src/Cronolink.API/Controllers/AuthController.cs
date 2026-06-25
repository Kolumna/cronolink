using Cronolink.Core.DTOs;
using Cronolink.Core.Exceptions;
using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;

namespace Cronolink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserRepository userRepo, IRefreshTokenRepository refreshRepo) : ControllerBase
{
  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginUserRequest req)
  {
    var user = await userRepo.GetByEmailAsync(req.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
    {
      return Unauthorized(new { error = "Invalid email or password" });
    }

    var token = GenerateJwtToken(user);

    var rawRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawRefreshToken));
    var refreshTokenHash = Convert.ToBase64String(hashBytes);

    var refreshToken = new RefreshToken
    {
      Id = Guid.NewGuid(),
      UserId = user.Id,
      TokenHash = refreshTokenHash,
      ExpiresAt = DateTime.UtcNow.AddDays(7),
      CreatedAt = DateTime.UtcNow
    };

    await refreshRepo.CreateAsync(refreshToken);

    var cookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Secure = Request.IsHttps,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddDays(7)
    };

    Response.Cookies.Append("refreshToken", rawRefreshToken, cookieOptions);

    return Ok(new AuthResponse(token, rawRefreshToken, user.MustChangePassword, user.IsProfileComplete, DateTime.UtcNow.AddHours(2)));
  }

  [HttpPost("refresh")]
  public async Task<IActionResult> Refresh()
  {
    var refreshTokenCookie = Request.Cookies["refreshToken"];
    if (string.IsNullOrEmpty(refreshTokenCookie)) return Unauthorized();

    var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshTokenCookie));
    var refreshTokenHash = Convert.ToBase64String(hashBytes);

    var refreshToken = await refreshRepo.GetByTokenHashAsync(refreshTokenHash);
    if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt < DateTime.UtcNow)
    {
      return Unauthorized(new { error = "Invalid or expired refresh token" });
    }

    var user = await userRepo.GetByIdAsync(refreshToken.UserId);
    if (user == null)
    {
      return Unauthorized(new { error = "User not found" });
    }

    await refreshRepo.RevokeAsync(refreshTokenHash);

    var newJwtToken = GenerateJwtToken(user);
    var newRawRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    var newHashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(newRawRefreshToken));
    var newRefreshTokenHash = Convert.ToBase64String(newHashBytes);

    var newRefreshToken = new RefreshToken
    {
      Id = Guid.NewGuid(),
      UserId = user.Id,
      TokenHash = newRefreshTokenHash,
      ExpiresAt = DateTime.UtcNow.AddDays(7),
      CreatedAt = DateTime.UtcNow
    };

    await refreshRepo.CreateAsync(newRefreshToken);

    var cookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Secure = Request.IsHttps,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddDays(7)
    };

    Response.Cookies.Append("refreshToken", newRawRefreshToken, cookieOptions);

    return Ok(new AuthResponse(newJwtToken, newRawRefreshToken, user.MustChangePassword, user.IsProfileComplete, DateTime.UtcNow.AddHours(2)));
  }

  [HttpPost("logout")]
  public async Task<IActionResult> Logout()
  {
    var refreshTokenCookie = Request.Cookies["refreshToken"];
    if (!string.IsNullOrEmpty(refreshTokenCookie))
    {
      var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshTokenCookie));
      var refreshTokenHash = Convert.ToBase64String(hashBytes);

      await refreshRepo.RevokeAsync(refreshTokenHash);
    }

    Response.Cookies.Delete("refreshToken");

    return Ok(new { message = "Logged out successfully" });
  }

  private static string GenerateJwtToken(User user)
  {
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

    var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
        ?? throw new Exception("JWT_KEY environment variable is missing.");

    var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

    var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddHours(2),
      Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
      Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
      SigningCredentials = creds
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
  }
}