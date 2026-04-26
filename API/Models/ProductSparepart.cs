namespace API.Models;

public class ProductSparepart
{
    public required string SparepartId { get; set; }
    public required string ProductId { get; set; }
    public Sparepart Sparepart { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
