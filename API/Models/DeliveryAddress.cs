using System;
using System.Collections.Generic;

namespace API.Models;

public class DeliveryAddress
{
    public required string Id { get; set; }
    public required string City { get; set; }
    public required string Postalcode { get; set; }
    public required string Address { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
