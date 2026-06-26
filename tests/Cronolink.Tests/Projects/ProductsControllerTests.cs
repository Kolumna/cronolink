using Cronolink.Api.Controllers;
using Cronolink.Core.DTOs;
using Cronolink.Core.Exceptions;
using Cronolink.Core.Interfaces;
using Cronolink.Core.Models;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using System;

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
        _repo.GetAllAsync().Returns(new List<Project> {
            new Project { Id = Guid.NewGuid(), Name = "Test Project", CreatedAt = DateTime.UtcNow }
        });

        var result = await _controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result);
        var items = Assert.IsType<IEnumerable<ProjectDto>>(ok.Value, exactMatch: false);
        Assert.Single(items);
    }

    [Fact]
    public async Task GetById_NotFound_ThrowsNotFoundException()
    {
        var id = Guid.NewGuid();
        _repo.GetByIdAsync(id).Returns((Project?)null);

        await Assert.ThrowsAsync<NotFoundException>(() => _controller.GetById(id));
    }

    [Fact]
    public async Task Create_ReturnsCreated()
    {
        var req = new CreateProjectRequest(Name: "Test Project",
            Description: "desc",
            GithubUrl: null,
            FinishedAt: null,
            Passwords: new List<PasswordRequestItem>(),
            StartedAt: null);
        _repo.CreateAsync(Arg.Any<Project>()).Returns(new Project { Id = Guid.NewGuid(), Name = req.Name, Description = req.Description, CreatedAt = DateTime.UtcNow });

        var result = await _controller.Create(req);

        Assert.IsType<CreatedAtActionResult>(result);
    }
}