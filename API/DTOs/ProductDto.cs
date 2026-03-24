using System;

namespace API.DTOs;

public class ProductDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public List<SparepartDto> Spareparts { get; set; } = [];
}

public class SparepartDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public required string Prize { get; set; }
    public required string PurchasePrize { get; set; }
    public int Balance { get; set; }
}

