namespace Cronolink.Core.DTOs;

public record ProjectDto(int Id, string Name, string? Description, DateTime UpdatedAt, DateTime CreatedAt);
public record CreateProjectRequest(string Name, string? Description);
public record UpdateProjectRequest(string Name, string? Description);