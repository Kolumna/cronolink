namespace Cronolink.Core.Models;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? GithubUrl { get; set; }
    public ICollection<ProjectPassword> Passwords { get; set; } = [];
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public byte[]? CoverImage { get; set; }
    public string? CoverImageContentType { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ProjectPassword
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}