using NBOX.Auth.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.AddServices();

var app = builder.Build();
app.MigrateDatabases();
app.ConfigureAndRun();