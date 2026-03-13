using System;
using System.Collections.Generic;

namespace API.Models;

public class Status
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
