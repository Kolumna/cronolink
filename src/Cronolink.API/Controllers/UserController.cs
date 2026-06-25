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
[Route("api/users")]
[Authorize]
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

  private static UserDto ToDto(User u) => new(u.Id, u.Email, u.FirstName, u.LastName, u.Role, u.UpdatedAt, u.CreatedAt);
}