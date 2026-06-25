
using Cronolink.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/setup")]
public class SetupController : ControllerBase
{
  private readonly IUserRepository _userRepository;

  public SetupController(IUserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  [HttpGet("status")]
  public async Task<IActionResult> GetSetupStatus()
  {
    var users = await _userRepository.GetAllAsync();
    return Ok(new { isSetupComplete = users.Count != 0 });
  }
}