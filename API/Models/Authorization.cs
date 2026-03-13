using System;
using System.Collections.Generic;

namespace API.Models;

public class Authorization
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
}
