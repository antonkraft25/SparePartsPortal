using System;

namespace API.Models;

public class Product
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public ICollection<ProductSparepart> ProductSpareparts { get; set; } = new List<ProductSparepart>();
}
