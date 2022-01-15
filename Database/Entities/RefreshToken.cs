using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace NBOX.Auth.Database.Entities;

[Owned]
public class RefreshToken : BaseEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonIgnore]
    [Required]
    public Guid Id { get; init; }
    [Required]
    public string Token { get; init; } = "";
    [Required]
    public DateTime Expires { get; init; }
    [Required]
    public string CreatedByIp { get; init; } = "";
    [Required]
    public DateTime? Revoked { get; init; }
    [Required]
    public string RevokedByIp { get; init; } = "";
    [Required]
    public string ReplacedByToken { get; init; } = "";
    [Required]
    public string ReasonRevoked { get; init; } = "";
    public bool IsExpired => DateTime.UtcNow >= Expires;
    public bool IsRevoked => Revoked != null;
    public bool IsActive => !IsRevoked && !IsExpired;
}