using Cronolink.Core.DTOs;
using Cronolink.Core.Exceptions;
using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cronolink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(IProjectRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok((await repo.GetAllAsync()).Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        return Ok(ToDto(project));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectRequest req)
    {
        var project = await repo.CreateAsync(new Project { Name = req.Name });
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, ToDto(project));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateProjectRequest req)
    {
        var project = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        project.Name = req.Name;
        await repo.UpdateAsync(project);
        return Ok(ToDto(project));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        _ = await repo.GetByIdAsync(id) ?? throw new NotFoundException($"Project {id} not found");
        await repo.DeleteAsync(id);
        return NoContent();
    }

    private static ProjectDto ToDto(Project p) => new(p.Id, p.Name, p.CreatedAt);
}