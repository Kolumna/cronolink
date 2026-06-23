using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Cronolink.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Cronolink.Infrastructure.Repositories;

public class AuthRepository(AppDbContext db) : IUserRepository
{
    public Task<List<User>> GetAllAsync(CancellationToken ct = default)
    {
        return db.Users.AsNoTracking().ToListAsync(ct);
    }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default)
    {
        return db.Users.AnyAsync(u => u.Email == email, ct);
    }

    public async Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken ct = default)
    {
        db.Users.Update(user);
        await db.SaveChangesAsync(ct);
        return user;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await db.Users.Where(u => u.Id == id).ExecuteDeleteAsync(ct);
    }
}