using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Cronolink.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Cronolink.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public Task<List<User>> GetAllAsync()
    {
        return db.Users.ToListAsync();
    }


    public Task<User?> GetByIdAsync(Guid id)
    {
        return db.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public Task<User?> GetByEmailAsync(string email)
    {
        return db.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public Task<bool> ExistsByEmailAsync(string email)
    {
        return db.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<User> CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        db.Users.Update(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(Guid id)
    {
        await db.Users.Where(u => u.Id == id).ExecuteDeleteAsync();
    }
}
