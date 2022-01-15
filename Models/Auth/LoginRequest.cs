using System.ComponentModel.DataAnnotations;

namespace NBOX.Auth.Models;

public record LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = "";
    [Required]
    public string Password { get; init; } = "";
}
