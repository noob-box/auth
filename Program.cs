using NBOX.Auth.Extensions;

namespace NBOX.Auth;

class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.AddServices();

        var app = builder.Build();
        app.MigrateDatabases();
        app.ConfigureAndRun();
    }
}
