using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductController(IRepository<Product> productRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        return Ok(await productRepository.GetAllAsync());
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
