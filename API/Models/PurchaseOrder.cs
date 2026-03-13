using System;
using System.Collections.Generic;

namespace API.Models;

public class PurchaseOrder
{
    public required string Id { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public required string UserId { get; set; }
    public required string StatusId { get; set; }
    public User User { get; set; } = null!;
    public Status Status { get; set; } = null!; 
    public ICollection<PoSparepart> PoSpareparts { get; set; } = new List<PoSparepart>();
}
