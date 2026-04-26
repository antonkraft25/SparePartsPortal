using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Roles
        string[] roles = ["Admin", "Tekniker", "Lagerpersonal"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // Statuses
        if (!await context.Statuses.AnyAsync())
        {
            var statuses = new List<Status>
{
                new() { Id = "1", Name = "Pending" },
                new() { Id = "2", Name = "Confirmed" },
                new() { Id = "3", Name = "Shipped" },
                new() { Id = "4", Name = "Delivered" },
                new() { Id = "5", Name = "Cancelled" },
                new() { Id = "6", Name = "Partially Delivered" }
            };
            await context.Statuses.AddRangeAsync(statuses);
            await context.SaveChangesAsync();
        }

        // Customers
        if (!await context.Customers.AnyAsync())
        {
            var customers = new List<Customer>
            {
                new() { Id = "1", Name = "NCS", City = "Köping", Postalcode = "73133", StreetName = "Kylgatan 1" },
                new() { Id = "2", Name = "Sportslagen", City = "Örebro", Postalcode = "70211", StreetName = "Frostvägen 5" },
                new() { Id = "3", Name = "Bruket", City = "Kolsva", Postalcode = "73145", StreetName = "Bruksvägen 12" }
            };
            await context.Customers.AddRangeAsync(customers);
            await context.SaveChangesAsync();
        }

        // Delivery Addresses
        if (!await context.DeliveryAddresses.AnyAsync())
        {
            var addresses = new List<DeliveryAddress>
            {
                new() { Id = "1", City = "Köping", Postalcode = "73112", StreetName = "Gymvägen 1" },
                new() { Id = "2", City = "Örebro", Postalcode = "70211", StreetName = "Kungsgatan 5" },
                new() { Id = "3", City = "Kolsva", Postalcode = "70298", StreetName = "Leveransvägen 12" }
            };
            await context.DeliveryAddresses.AddRangeAsync(addresses);
            await context.SaveChangesAsync();
        }

        // Spareparts
        if (!await context.Spareparts.AnyAsync())
        {
            var spareparts = new List<Sparepart>
            {
                new() { Id = "1", Name = "Kompressor", PurchasePrize = "1500", Prize = "2500", Location = "A1", Balance = 10, IsActive = true },
                new() { Id = "2", Name = "Fläkt", PurchasePrize = "200", Prize = "400", Location = "A2", Balance = 25, IsActive = true },
                new() { Id = "3", Name = "Kondensor", PurchasePrize = "800", Prize = "1400", Location = "B1", Balance = 8, IsActive = true },
                new() { Id = "4", Name = "Förångare", PurchasePrize = "600", Prize = "1100", Location = "B2", Balance = 12, IsActive = true },
                new() { Id = "5", Name = "Expansionsventil", PurchasePrize = "300", Prize = "550", Location = "C1", Balance = 20, IsActive = true },
                new() { Id = "6", Name = "Motor", PurchasePrize = "900", Prize = "1600", Location = "C2", Balance = 6, IsActive = true }
            };
            await context.Spareparts.AddRangeAsync(spareparts);
            await context.SaveChangesAsync();
        }

        // Products
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new()
                {
                    Id = "1",
                    Name = "S880",
                    ProductSpareparts = new List<ProductSparepart>
                    {
                        new() { ProductId = "1", SparepartId = "1" },
                        new() { ProductId = "1", SparepartId = "2" },
                        new() { ProductId = "1", SparepartId = "3" }
                    }
                },
                new()
                {
                    Id = "2",
                    Name = "D390",
                    ProductSpareparts = new List<ProductSparepart>
                    {
                        new() { ProductId = "2", SparepartId = "1" },
                        new() { ProductId = "2", SparepartId = "4" },
                        new() { ProductId = "2", SparepartId = "5" },
                        new() { ProductId = "2", SparepartId = "6" }
                    }
                }
            };
            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }

        // Users
        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                UserName = "stefan@test.com",
                Email = "stefan@test.com",
                FirstName = "Stefan",
                LastName = "Jansson",
                CustomerId = "1"
            };
            await userManager.CreateAsync(adminUser, "password");
            await userManager.AddToRoleAsync(adminUser, "Admin");

            var teknikerUser = new User
            {
                UserName = "martin@test.com",
                Email = "martin@test.com",
                FirstName = "Martin",
                LastName = "Stek",
                CustomerId = "2"
            };
            await userManager.CreateAsync(teknikerUser, "password");
            await userManager.AddToRoleAsync(teknikerUser, "Tekniker");

            var lagerUser = new User
            {
                UserName = "micke@test.com",
                Email = "mick@test.com",
                FirstName = "Micke",
                LastName = "Fyris",
                CustomerId = "3"
            };
            await userManager.CreateAsync(lagerUser, "password");
            await userManager.AddToRoleAsync(lagerUser, "Lagerpersonal");
        }
    }
}