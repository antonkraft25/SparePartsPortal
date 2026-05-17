namespace API.DTOs;

public class PurchaseOrderDto
{
    public required string Id { get; set; }
    public required DateTime Date { get; set; }
    public required string Status { get; set; }
    public required string UserName { get; set; }
    public List<PoItemResultDto> Items { get; set; } = [];
}

public class PoItemResultDto
{
    public required string SparepartId { get; set; }
    public required string SparepartName { get; set; }
    public required string SparepartLocation { get; set; }
    public int Quantity { get; set; }
    public int QuantityReceived { get; set; }
}