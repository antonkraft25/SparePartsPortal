namespace API.DTOs;

public class UserListDto
{
    public required string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string CustomerName { get; set; }
    public required string Role { get; set; }
}