namespace API.DTOs;

public class PurchaseOrderCreateDto
{
    public List<PoItemDto> Items { get; set; } = [];
}

public class PoItemDto
{
    public required string SparepartId { get; set; }
    public int Quantity { get; set; }
}