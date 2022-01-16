using NBOX.Auth.Database;
using NBOX.Auth.Database.Entities;

namespace NBOX.Auth.Services;

public interface IUserService
{
    User AddUser(string email, string password, string name, UserRole role = UserRole.User);

    User? GetUserById(string id);
    User? GetUserByEmail(string email);

    IEnumerable<User> GetUsers();

    bool validatePassword(User user, string plainPassword);
}

public class UserService : IUserService
{
    private ILogger<UserService> _logger;
    private AppDbContext _userContext;
    private IPasswordService _passwordService;

    public UserService(ILogger<UserService> logger, AppDbContext userContext, IPasswordService passwordService)
    {
        _logger = logger;
        _userContext = userContext;
        _passwordService = passwordService;
    }

    public User AddUser(string email, string password, string name, UserRole role = UserRole.User)
    {
        if (String.IsNullOrEmpty(email)) throw new ArgumentNullException(nameof(email));
        if (String.IsNullOrEmpty(password)) throw new ArgumentNullException(nameof(password));
        if (String.IsNullOrEmpty(name)) throw new ArgumentNullException(nameof(name));

        var user = new User()
        {
            Email = email,
            HashedPassword = _passwordService.Hash(password),
            Name = name,
            Role = role
        };

        _userContext.Users.Add(user);
        _userContext.SaveChanges();

        return user;
    }

    public User? GetUserByEmail(string email)
    {
        if (String.IsNullOrEmpty(email)) throw new ArgumentNullException(nameof(email));

        return _userContext.Users.Where(x => x.Email == email).FirstOrDefault();
    }

    public User? GetUserById(string id)
    {
        if (String.IsNullOrEmpty(id)) throw new ArgumentNullException(nameof(id));

        return _userContext.Users.Where(x => x.Id == new Guid(id)).FirstOrDefault();
    }

    public IEnumerable<User> GetUsers()
    {
        return _userContext.Users.ToList();
    }

    public bool validatePassword(User user, string plainPassword)
    {
        return _passwordService.Verify(plainPassword, user.HashedPassword);
    }
}