using System.Text.Json.Serialization;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace NBOX.Auth.Models;

public record IndividualHealthCheckResponse
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public HealthStatus Status { get; set; }
    public string Component { get; set; }
}