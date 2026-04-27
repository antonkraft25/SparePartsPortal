using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;

namespace API.Controllers;

[Authorize]
public class UserController(
    UserManager<User> userManager,
    AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListDto>>> GetAllUsers()
    {
        var users = await userManager.Users
            .Include(u => u.Customer)
            .ToListAsync();

        var result = new List<UserListDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            result.Add(new UserListDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                CustomerName = user.Customer.Name,
                Role = roles.FirstOrDefault() ?? "Ingen roll"
            });
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult> CreateUser(RegisterDto dto)
    {
        if (await userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest("Email redan används");

        var user = new User
        {
            Email = dto.Email,
            UserName = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CustomerId = dto.CustomerId
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        await userManager.AddToRoleAsync(user, dto.Role);

        return Ok();
    }
}