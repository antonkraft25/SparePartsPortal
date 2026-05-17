namespace API.Models;

public class PoSparepart
{
    public required string PurchaseOrderId { get; set; }
    public required string SparepartId { get; set; }
    public int Quantity { get; set; } = 1;
    public int QuantityReceived { get; set; } = 0;
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public Sparepart Sparepart { get; set; } = null!;
}