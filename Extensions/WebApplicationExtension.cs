using Microsoft.EntityFrameworkCore;
using NBOX.Auth.Authorization;

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
        app.MapHealthChecks("/health");

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
