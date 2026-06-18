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

namespace Cronolink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserRepository repo) : ControllerBase
{
  [HttpGet]
  public async Task<IActionResult> GetAll()
  {
    return Ok((await repo.GetAllAsync()).Select(ToDto));
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById(Guid id)
  {
    var user = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"User {id} not found");
    return Ok(ToDto(user));
  }

  [HttpPost("create")]
  public async Task<IActionResult> Create(CreateUserRequest req)
  {
    var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
    var user = await repo.CreateAsync(new User
    {
      Id = Guid.NewGuid(),
      FirstName = req.FirstName,
      LastName = req.LastName,
      Email = req.Email,
      PasswordHash = passwordHash
    });
    return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToDto(user));
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginUserRequest req)
  {
    var user = await repo.GetByEmailAsync(req.Email) ?? throw new UnauthorizedAccessException("Invalid credentials");
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
    {
      throw new UnauthorizedAccessException("Invalid credentials");
    }
    var token = GenerateJwtToken(user);
    return Ok(new AuthResponse(token));
  }

  [HttpPut("{id:guid}")]
  public async Task<IActionResult> Update(Guid id, UpdateUserRequest req)
  {
    var user = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"User {id} not found");
    user.FirstName = req.FirstName;
    user.LastName = req.LastName;
    user.Email = req.Email;
    user.PasswordHash = req.PasswordHash;
    await repo.UpdateAsync(user);
    return Ok(ToDto(user));
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> Delete(Guid id)
  {
    _ = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"User {id} not found");
    await repo.DeleteAsync(id);
    return NoContent();
  }

  private static UserDto ToDto(User u) => new(u.Id, u.Email);

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