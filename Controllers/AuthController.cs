using Microsoft.AspNetCore.Mvc;
using NBOX.Auth.Authorization;
using NBOX.Auth.Database.Entities;
using NBOX.Auth.Models;
using NBOX.Auth.Services;
using NBOX.Auth.Utils;

namespace NBOX.Auth.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    public AuthController(ILogger<AuthController> logger, IUserService userService, ITokenService tokenService)
    {
        _logger = logger;
        _userService = userService;
        _tokenService = tokenService;
    }

    [HttpPost("Login")]
    public ActionResult<LoginResponse> PostLogin([FromBody] LoginRequest request)
    {
        _logger.LogInformation("email: {0}\tpassword: {1}", request.Email, request.Password);
        var user = _userService.GetUserByEmail(request.Email);
        if (user == null) return NotFound();

        var validPassword = _userService.validatePassword(user, request.Password);
        if (!validPassword) return Unauthorized();

        var (token, cookieOptions) = _tokenService.GenerateTokenWithCookieOptions(user);

        Response.Cookies.Append("accessToken", token, cookieOptions);

        return Ok(new LoginResponse()
        {
            Token = token
        });
    }

    [HttpPost("Register")]
    public ActionResult<User> PostRegister([FromBody] RegisterRequest request)
    {
        var user = _userService.GetUserByEmail(request.Email);
        if (user != null) return Conflict();

        var createdUser = _userService.AddUser(request.Email, request.Password, request.Name);

        return CreatedAtAction(nameof(UserController.GetProfile), ControllerUtils.GetControllerRoute<UserController>(), null, createdUser);
    }
}
