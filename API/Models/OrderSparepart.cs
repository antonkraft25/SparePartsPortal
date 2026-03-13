using System;

namespace API.Models;

public class OrderSparepart
{
    public required string OrderId { get; set; }
    public required string SparepartId { get; set; }
    public Order Order { get; set; } = null!; 
    public Sparepart Sparepart { get; set; } = null!;
}
