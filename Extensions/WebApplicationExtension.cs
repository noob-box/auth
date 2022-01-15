using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using NBOX.Auth.Models;

namespace NBOX.Auth.Extensions;

public static class WebApplicationExtension
{

    public static void ConfigureAndRun(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        //app.MapHealthChecks("/health");
        app.UseHealthChecks("/health", new HealthCheckOptions
        {
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                var response = new HealthCheckReponse
                {
                    Status = report.Status,
                    Components = report.Entries.Select(x => new IndividualHealthCheckResponse
                    {
                        Component = x.Key,
                        Status = x.Value.Status
                    }),
                    Duration = report.TotalDuration
                };
                await context.Response.WriteAsJsonAsync(response);
            }
        });

        app.Run();
    }

    public static void MigrateDatabases(this WebApplication app)
    {
        using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            var contexts = serviceScope.ServiceProvider.GetServices<DbContext>();
            foreach (var db in contexts)
            {
                db.Database.Migrate();
            }
        }
    }
}
