using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LogIn(LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
            if (user == null)
                return Unauthorized("Invalid email or password");

            if (user.Password != loginDto.Password)
                return Unauthorized("Invalid email or password");

            var token = tokenService.CreateToken(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = token
            };

            return Ok(userDto);
        }
    }
}
