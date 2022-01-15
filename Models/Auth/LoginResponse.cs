
using System.ComponentModel.DataAnnotations;

namespace NBOX.Auth.Models;

public record LoginResponse
{
    [Required]
    public string Token { get; init; } = "";
}
