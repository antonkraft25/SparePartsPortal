using System;

namespace API.DTOs;

public class RegisterDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string CustomerId { get; set; }
    public required string Role { get; set; }
}
