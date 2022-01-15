using System.ComponentModel.DataAnnotations;

namespace NBOX.Auth.Models;

public record UserPatchRequest
{
    [EmailAddress]
    public string? Email { get; init; }

    public string? Name { get; init; }
}