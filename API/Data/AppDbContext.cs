using System;
using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Authorization> Authorizations { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<DeliveryAddress> DeliveryAddresses { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Sparepart> Spareparts { get; set; }
    public DbSet<OrderSparepart> OrderSpareparts { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PoSparepart> PoSpareparts { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSparepart> ProductSpareparts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OrderSparepart>().HasKey(os => new { os.OrderId, os.SparepartId });
        modelBuilder.Entity<PoSparepart>().HasKey(po => new { po.PurchaseOrderId, po.SparepartId });
        modelBuilder.Entity<ProductSparepart>().HasKey(ps => new { ps.ProductId, ps.SparepartId });
    }
}
