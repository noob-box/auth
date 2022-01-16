using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;
using NBOX.Auth.Database.Entities;
using NBOX.Auth.Models;

namespace NBOX.Auth.Database;

public class AppDbContext : DbContext
{
    private AppSettings _appSettings;
    public DbSet<User> Users => Set<User>();

    public AppDbContext(DbContextOptions options, IOptions<AppSettings> appSettings) : base(options)
    {
        if (appSettings is null) throw new ArgumentNullException(nameof(appSettings));
        _appSettings = appSettings.Value;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_appSettings.DbConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        if (modelBuilder is null) throw new ArgumentNullException(nameof(modelBuilder));

        var entity = modelBuilder.Entity<User>();
        entity.HasKey(nameof(User.Id), nameof(User.Email));

        var enumToStringConverter = new EnumToStringConverter<UserRole>();
        entity.Property(e => e.Role).HasConversion(enumToStringConverter);
    }

    public override int SaveChanges()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                    e.State == EntityState.Added
                    || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var now = DateTime.UtcNow;
            ((BaseEntity)entityEntry.Entity).UpdatedAt = now;

            if (entityEntry.State == EntityState.Added)
            {
                ((BaseEntity)entityEntry.Entity).CreatedAt = now;
            }
        }

        return base.SaveChanges();
    }

}
