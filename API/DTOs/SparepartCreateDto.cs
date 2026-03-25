using System;

namespace API.DTOs;

public class SparepartCreateDto
{
    public required string Name { get; set; }
    public required string PurchasePrize { get; set; }
    public required string Prize { get; set; }
    public required string Location { get; set; }
    public int Balance { get; set; }
    public List<string> ProductIds { get; set; } = [];
}
