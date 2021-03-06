using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace NBOX.Auth.Models;

public record HealthCheckReponse
{
    public HealthStatus Status { get; init; }
    public IEnumerable<IndividualHealthCheckResponse> Components { get; init; } = new List<IndividualHealthCheckResponse>();
    public TimeSpan Duration { get; init; }
}