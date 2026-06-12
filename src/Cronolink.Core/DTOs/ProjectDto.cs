namespace Cronolink.Core.DTOs;

public record ProjectDto(int Id, string Name, DateTime CreatedAt);
public record CreateProjectRequest(string Name);
public record UpdateProjectRequest(string Name);