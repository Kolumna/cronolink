using Cronolink.Core.DTOs;
using Cronolink.Core.Exceptions;
using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Cronolink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController(IProjectRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok((await repo.GetAllAsync()).Select(ToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var project = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        return Ok(ToDto(project));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectRequest req)
    {
        var passwordEntities = req.Passwords.Select(p => new ProjectPassword
        {
            Name = p.Name,
            Value = p.Value
        }).ToList();

        var newProject = new Project
        {
            Name = req.Name,
            Description = req.Description,
            GithubUrl = req.GithubUrl,
            StartedAt = req.StartedAt,
            FinishedAt = req.FinishedAt,
            Passwords = passwordEntities
        };
        var project = await repo.CreateAsync(newProject);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, ToDto(project));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateProjectRequest req)
    {
        var passwordEntities = req.Passwords.Select(p => new ProjectPassword
        {
            Name = p.Name,
            Value = p.Value
        }).ToList();

        var project = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        project.Name = req.Name;
        project.Description = req.Description;
        project.GithubUrl = req.GithubUrl;
        project.StartedAt = req.StartedAt;
        project.FinishedAt = req.FinishedAt;
        project.UpdatedAt = DateTime.UtcNow;
        project.Passwords = passwordEntities;
        await repo.UpdateAsync(project);
        return Ok(ToDto(project));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        _ = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        await repo.DeleteAsync(id);
        return NoContent();
    }

    private static ProjectDto ToDto(Project p) => new(
     p.Id,
     p.Name,
     p.Description,
     p.GithubUrl,
     p.Passwords.Select(pp => new ProjectPasswordDto(pp.Id, pp.Name, pp.Value)).ToList(),
     p.StartedAt,
     p.FinishedAt,
     p.UpdatedAt,
     p.CreatedAt
 );
}