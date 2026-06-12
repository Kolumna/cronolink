using Cronolink.Api.Controllers;
using Cronolink.Core.DTOs;
using Cronolink.Core.Exceptions;
using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace Cronolink.Tests.Projects;

public class ProjectsControllerTests
{
    private readonly IProjectRepository _repo = Substitute.For<IProjectRepository>();
    private readonly ProjectsController _controller;

    public ProjectsControllerTests()
    {
        _controller = new ProjectsController(_repo);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithProjects()
    {
        _repo.GetAllAsync().Returns([
            new Project { Id = 1, Name = "Test Project", CreatedAt = DateTime.UtcNow }
        ]);

        var result = await _controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result);
        var items = Assert.IsType<IEnumerable<ProjectDto>>(ok.Value, exactMatch: false);
        Assert.Single(items);
    }

    [Fact]
    public async Task GetById_NotFound_ThrowsNotFoundException()
    {
        _repo.GetByIdAsync(99).Returns((Project?)null);

        await Assert.ThrowsAsync<NotFoundException>(() => _controller.GetById(99));
    }

    [Fact]
    public async Task Create_ReturnsCreated()
    {
        var req = new CreateProjectRequest("New Project");
        _repo.CreateAsync(Arg.Any<Project>()).Returns(new Project { Id = 1, Name = req.Name, CreatedAt = DateTime.UtcNow });

        var result = await _controller.Create(req);

        Assert.IsType<CreatedAtActionResult>(result);
    }
}