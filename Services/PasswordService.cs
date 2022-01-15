using Isopoh.Cryptography.Argon2;

namespace NBOX.Auth.Services;

public interface IPasswordService
{
    string Hash(string plainPassword);
    bool Verify(string plainPassword, string hashedPassword);
}

public class PasswordService : IPasswordService
{
    public string Hash(string plainPassword)
    {
        if (String.IsNullOrEmpty(plainPassword)) throw new ArgumentNullException(nameof(plainPassword));
        return Argon2.Hash(plainPassword);
    }

    public bool Verify(string plainPassword, string hashedPassword)
    {
        if (String.IsNullOrEmpty(plainPassword)) throw new ArgumentNullException(nameof(plainPassword));
        if (String.IsNullOrEmpty(hashedPassword)) throw new ArgumentNullException(nameof(hashedPassword));

        return Argon2.Verify(hashedPassword, plainPassword);
    }
}