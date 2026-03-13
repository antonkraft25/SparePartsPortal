using System;

namespace API.Models;

public class PoSparepart
{
    public required string PurchaseOrderId { get; set; }
    public required string SparepartId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public Sparepart Sparepart { get; set; } = null!; 
}
