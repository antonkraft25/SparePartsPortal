using System;

namespace API.DTOs;

public class UpdateProfileDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
}
