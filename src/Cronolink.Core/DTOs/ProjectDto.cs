using Cronolink.Core.Models;

namespace Cronolink.Core.DTOs;

public record ProjectDto(
    Guid Id,
    string Name,
    string? Description,
    string? GithubUrl,
    List<ProjectPasswordDto> Passwords,
    DateTime? StartedAt,
    DateTime? FinishedAt,
    DateTime UpdatedAt,
    DateTime CreatedAt
);
public record CreateProjectRequest(string Name, string? Description, string? GithubUrl, DateTime? FinishedAt, List<PasswordRequestItem> Passwords, DateTime? StartedAt);
public record UpdateProjectRequest(string Name, string? Description, string? GithubUrl, DateTime? StartedAt, List<PasswordRequestItem> Passwords, DateTime? FinishedAt);

public record PasswordRequestItem(string Name, string Value);
public record ProjectPasswordDto(Guid Id, string Name, string Value);