using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BCrypt.Net;

namespace Cronolink.Infrastructure.Seed;

public static class AdminUserSeeder
{
  public static async Task SeedAsync(IServiceProvider services)
  {
    using var scope = services.CreateScope();
    var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<InvalidProgramException>>();

    var existingUsers = await userRepository.GetAllAsync();
    if (existingUsers.Any())
    {
      return;
    }

    var email = Environment.GetEnvironmentVariable("INITIAL_ADMIN_EMAIL");
    var password = Environment.GetEnvironmentVariable("INITIAL_ADMIN_PASSWORD");

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
      logger.LogWarning("INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD nie ustawione - pomijam seed admina.");
      return;
    }

    var user = new User
    {
      Email = email,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
      Role = UserRole.Admin,
      MustChangePassword = true,
      IsProfileComplete = false,
      CreatedAt = DateTime.UtcNow
    };

    await userRepository.CreateAsync(user);

    logger.LogInformation("Utworzono domyślnego użytkownika admina: {Email}", email);
  }
}