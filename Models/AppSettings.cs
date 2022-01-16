using System.ComponentModel.DataAnnotations;

namespace NBOX.Auth.Models;

public class AppSettings
{
    [Required]
    public string DbConnectionString { get; init; } = "";

    [Required]
    [MinLength(32)]
    public string JwtSecret { get; init; } = "";

    [Required]
    public string JwtIssuer { get; init; } = "";

    [Required]
    public string JwtAudience { get; init; } = "";

    [Required]
    [Range(60, 86400)]
    public int AccessTokenExpiry { get; init; }

    [Required]
    [Range(86400, 7889238)]
    public int RefreshTokenExpiry { get; init; }
}