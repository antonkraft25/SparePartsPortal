using System;

namespace API.DTOs;

public class CustomerCreateDto
{
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Postalcode { get; set; }
    public required string StreetName { get; set; }
}
