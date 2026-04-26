namespace API.Models;

public class OrderSparepart
{
    public required string OrderId { get; set; }
    public required string SparepartId { get; set; }
    public int Quantity { get; set; } = 1;
    public int QuantitySent { get; set; } = 0;
    public Order Order { get; set; } = null!;
    public Sparepart Sparepart { get; set; } = null!;
}