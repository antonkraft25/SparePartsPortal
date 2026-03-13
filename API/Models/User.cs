using System;
using System.Collections.Generic;

namespace API.Models;

public class User
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string FristName { get; set; }
    public required string LastName { get; set; }
    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    public required string CustomerId { get; set; }
    public required string AuthorizationId { get; set; }
    public Customer Customer { get; set; } = null!;
    public Authorization Authorization { get; set; } = null!;
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
