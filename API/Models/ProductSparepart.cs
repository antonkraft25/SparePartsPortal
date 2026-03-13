using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class ProductSparepart
{
    public required string SparepartId { get; set; }
    public required string ProductId { get; set; }
    public Sparepart sparepart { get; set; } = null!;
    public Product product { get; set; } = null!;
}
