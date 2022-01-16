using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NBOX.Auth.Database.Entities;
using NBOX.Auth.Models;
using NBOX.Auth.Services;

namespace NBOX.Auth.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;

    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    [HttpGet]
    public ActionResult<User> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(_userService.GetUserById(userId));
    }

    [HttpPatch]
    public ActionResult<User> PatchProfile([FromBody] UserPatchRequest requestUser)
    {
        return Ok(_userService.GetUsers().First());
    }
}
