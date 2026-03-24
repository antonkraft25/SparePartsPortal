using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductController(IRepository<Product> productRepository, AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        return Ok(await productRepository.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(string id)
    {
        var product = await context.Products
            .Include(p => p.ProductSpareparts)
            .ThenInclude(ps => ps.Sparepart)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();

        var dto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Spareparts = product.ProductSpareparts.Select(ps => new SparepartDto
            {
                Id = ps.Sparepart.Id,
                Name = ps.Sparepart.Name,
                Location = ps.Sparepart.Location,
                Prize = ps.Sparepart.Prize,
                PurchasePrize = ps.Sparepart.PurchasePrize,
                Balance = ps.Sparepart.Balance
            }).ToList()
        };

        return Ok(dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProduct(string id, ProductUpdateDto dto)
    {
        var product = await productRepository.GetByIdAsync(id);

        if (product == null) return NotFound();

        product.Name = dto.Name;
        productRepository.Update(product);
        await productRepository.SaveChangesAsync();

        return Ok(product);
    }

    [HttpDelete("{id}/sparepart/{sparepartId}")]
    public async Task<ActionResult> RemoveSparepart(string id, string sparepartId)
    {
        var link = await context.ProductSpareparts
            .FirstOrDefaultAsync(ps => ps.ProductId == id && ps.SparepartId == sparepartId);

        if (link == null) return NotFound();

        context.ProductSpareparts.Remove(link);
        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult> CreateProduct(ProductCreateDto dto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name
        };

        await productRepository.AddAsync(product);
        await productRepository.SaveChangesAsync();

        return Ok(product);
    }
}
}
