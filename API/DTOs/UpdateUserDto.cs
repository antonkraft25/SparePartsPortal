namespace API.DTOs;

public class UpdateUserDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string CustomerId { get; set; }
    public required string Role { get; set; }
}