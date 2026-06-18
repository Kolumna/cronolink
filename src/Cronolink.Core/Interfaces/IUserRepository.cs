using Cronolink.Core.Models;

namespace Cronolink.Core.Interfaces;

public interface IUserRepository
{
  Task<List<User>> GetAllAsync();
  Task<User?> GetByIdAsync(Guid id);
  Task<User?> GetByEmailAsync(string email);
  Task<bool> ExistsByEmailAsync(string email);
  Task<User> CreateAsync(User user);
  Task<User> UpdateAsync(User user);
  Task DeleteAsync(Guid id);
}