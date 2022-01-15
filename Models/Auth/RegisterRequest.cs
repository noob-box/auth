using System.ComponentModel.DataAnnotations;

namespace NBOX.Auth.Models;

public record RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = "";
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#§@$!%*?&=\/\\\(\)\[\]\{\}\+\-_])[A-Za-z\d#§@$!%*?&=\/\\\(\)\[\]\{\}\+\-_]{8,}$", ErrorMessage = "The {0} field needs to contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.")]
    public string Password { get; init; } = "";
    [Required]
    public string Name { get; init; } = "";
}
