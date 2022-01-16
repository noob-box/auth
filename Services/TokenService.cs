using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NBOX.Auth.Database.Entities;
using NBOX.Auth.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace NBOX.Auth.Authorization;

public interface ITokenService
{
    public JwtSecurityToken GenerateJwtToken(User user);
    public (string, CookieOptions) GenerateTokenWithCookieOptions(User user);
    public RefreshToken GenerateRefreshToken(string ipAddress);
}

public class TokenService : ITokenService
{
    private readonly AppSettings _appSettings;

    public TokenService(IOptions<AppSettings> appSettings)
    {
        if (appSettings is null) throw new ArgumentNullException(nameof(appSettings));
        _appSettings = appSettings.Value;
    }

    public JwtSecurityToken GenerateJwtToken(User user)
    {
        if (user is null) throw new ArgumentNullException(nameof(user));

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JwtSecret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _appSettings.JwtIssuer,
            _appSettings.JwtAudience,
            new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", user.Role.ToString()),
            },
            expires: DateTime.UtcNow.AddSeconds(_appSettings.AccessTokenExpiry),
            signingCredentials: credentials
        );

        return token;
    }

    public (string, CookieOptions) GenerateTokenWithCookieOptions(User user)
    {
        var token = GenerateJwtToken(user);
        var cookieOptions = new CookieOptions
        {
            Secure = true,
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            MaxAge = token.ValidTo - DateTime.UtcNow
        };

        return (new JwtSecurityTokenHandler().WriteToken(token), cookieOptions);
    }

    public RefreshToken GenerateRefreshToken(string ipAddress)
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        var refreshToken = new RefreshToken
        {
            Token = Convert.ToBase64String(randomBytes),
            Expires = DateTime.UtcNow.AddSeconds(_appSettings.RefreshTokenExpiry),
            CreatedByIp = ipAddress
        };

        return refreshToken;
    }
}
