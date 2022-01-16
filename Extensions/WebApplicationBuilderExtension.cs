using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NBOX.Auth.Authorization;
using NBOX.Auth.Database;
using NBOX.Auth.Models;
using NBOX.Auth.Services;

namespace NBOX.Auth.Extensions;

public static class WebApplicationBuilderExtension
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        if (builder is null) throw new ArgumentNullException(nameof(builder));

        var services = builder.Services;
        var config = builder.Configuration;

        services.Configure<AppSettings>(config.GetRequiredSection("AppSettings"));
        services.AddOptions<AppSettings>()
            .Bind(config.GetSection(nameof(AppSettings)))
            .ValidateDataAnnotations();

        services.AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        services.AddDbContext<AppDbContext>();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddHealthChecks()
            .AddDbContextCheck<AppDbContext>("Database");

        var auth = services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
        auth.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config["AppSettings:JwtIssuer"],
                ValidAudience = config["AppSettings:JwtAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:JwtSecret"]))
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["accessToken"];
                    return Task.CompletedTask;
                },
            };
        });

        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();
    }

}
