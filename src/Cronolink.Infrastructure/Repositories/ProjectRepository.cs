using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Cronolink.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Cronolink.Infrastructure.Repositories;

public class ProjectRepository(AppDbContext db) : IProjectRepository
{
    public Task<List<Project>> GetAllAsync()
    {
        return db.Projects.Include(p => p.Passwords).ToListAsync();
    }


    public Task<Project?> GetByIdAsync(Guid id)
    {
        return db.Projects.Include(p => p.Passwords).FirstOrDefaultAsync(p => p.Id == id);
    }


    public async Task<Project> CreateAsync(Project project)
    {
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return project;
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        db.Projects.Update(project);
        await db.SaveChangesAsync();
        return project;
    }

    public async Task DeleteAsync(Guid id)
    {
        await db.Projects.Where(p => p.Id == id).ExecuteDeleteAsync();
    }
}
