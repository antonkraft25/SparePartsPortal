using System;
using System.Collections.Generic;

namespace API.Models;

public class Order
{
    public required string Id { get; set; }
    public required DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public required string DeliveryAddressId { get; set; }
    public required string StatusId { get; set; }
    public DeliveryAddress DeliveryAddress { get; set; } = null!;
    public Status Status { get; set; } = null!;
    public ICollection<OrderSparepart> OrderSpareparts { get; set; } = new List<OrderSparepart>();
}
