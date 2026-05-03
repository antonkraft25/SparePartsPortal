using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Helpers;

namespace API.Controllers;

[Authorize]
public class UserController(
    UserManager<User> userManager,
    AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult> GetAllUsers([FromQuery] PaginationParams paginationParams)
    {
        var users = await userManager.Users
            .Include(u => u.Customer)
            .Where(u => u.IsActive)
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync();

        var totalCount = await userManager.Users.Where(u => u.IsActive).CountAsync();

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
                CustomerId = user.CustomerId,
                CustomerName = user.Customer.Name,
                Role = roles.FirstOrDefault() ?? "Ingen roll"
            });
        }

        return Ok(new PagedList<UserListDto>
        {
            Items = result,
            TotalCount = totalCount,
            PageNumber = paginationParams.PageNumber,
            PageSize = paginationParams.PageSize
        });
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

    [HttpGet("{id}")]
    public async Task<ActionResult<UserListDto>> GetUser(string id)
    {
        var user = await userManager.Users
            .Include(u => u.Customer)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new UserListDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email!,
            CustomerId = user.CustomerId,
            CustomerName = user.Customer.Name,
            Role = roles.FirstOrDefault() ?? "Ingen roll"
        });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(string id, UpdateUserDto dto)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;
        user.UserName = dto.Email;
        user.NormalizedEmail = dto.Email.ToUpper();
        user.NormalizedUserName = dto.Email.ToUpper();
        user.CustomerId = dto.CustomerId;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Update role
        var currentRoles = await userManager.GetRolesAsync(user);
        await userManager.RemoveFromRolesAsync(user, currentRoles);
        await userManager.AddToRoleAsync(user, dto.Role);

        return Ok();
    }

    [HttpPut("{id}/disable")]
    public async Task<ActionResult> DisableUser(string id)
    {
        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        user.IsActive = false;
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok();
    }
}