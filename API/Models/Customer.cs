using System;
using System.Collections.Generic;

namespace API.Models;

public class Customer
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Postalcode { get; set; }
    public required string Address { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
}
