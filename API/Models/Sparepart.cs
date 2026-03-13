using System;
using System.Collections.Generic;

namespace API.Models;

public class Sparepart
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string PurchasePrize { get; set; }
    public required string Prize { get; set; }
    public required string Location { get; set; }
    public int Balance { get; set; }
    public ICollection<OrderSparepart> OrderSpareparts { get; set; } = new List<OrderSparepart>();
    public ICollection<ProductSparepart> ProductSpareparts { get; set; } = new List<ProductSparepart>();
    public ICollection<PoSparepart> PoSpareparts { get; set; } = new List<PoSparepart>();
}
