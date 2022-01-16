// model User {
//   id             String   @id @unique @default(uuid()) @db.Uuid
//   email          String   @unique
//   hashedPassword String
//   name           String
//   role           Role     @default(USER)
//   createdAt      DateTime @default(now())
//   updatedAt      DateTime @updatedAt

//   tokens Token[]
// }

// model Token {
//   id          Int       @id @default(autoincrement())
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
//   hashedToken String
//   type        TokenType
//   expiresAt   DateTime
//   userId      String    @db.Uuid
//   user        User      @relation(fields: [userId], references: [id])

//   @@unique([hashedToken, type])
// }

// enum Role {
//   USER
//   ADMIN
// }

// enum TokenType {
//   REFRESH
// }

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace NBOX.Auth.Database.Entities;

public enum UserRole
{
    User,
    Admin
}

[Index(nameof(Id), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User : BaseEntity
{
    private static DateTime now = DateTime.Now;

    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; init; }

    [Required]
    [EmailAddress]
    public string Email { get; init; } = "";

    [Required]
    [JsonIgnore]
    public string HashedPassword { get; init; } = "";

    [Required]
    public string Name { get; init; } = "";

    [Required]
    public UserRole Role { get; init; } = UserRole.User;
}
