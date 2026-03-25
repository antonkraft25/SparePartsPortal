using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SparepartsController(IRepository<Sparepart> repository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllSpareparts()
        {
            var spareparts = await repository.FindAsync(s => s.IsActive);
            return Ok(spareparts.Select(s => new
            {
                id = s.Id,
                name = s.Name,
                prize = s.Prize,
                purchasePrize = s.PurchasePrize,
                location = s.Location,
                balance = s.Balance
            }));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeactivateSparepart(string id)
        {
            var sparepart = await repository.GetByIdAsync(id);

            if (sparepart == null) return NotFound();

            sparepart.IsActive = false;
            repository.Update(sparepart);
            await repository.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> CreateSparepart(SparepartCreateDto dto)
        {
            try
            {
                var id = Guid.NewGuid().ToString();
                var sparepart = new Sparepart
                {
                    Id = id,
                    Name = dto.Name,
                    PurchasePrize = dto.PurchasePrize,
                    Prize = dto.Prize,
                    Location = dto.Location,
                    Balance = dto.Balance,
                    ProductSpareparts = dto.ProductIds.Select(productId => new ProductSparepart
                    {
                        ProductId = productId,
                        SparepartId = id
                    }).ToList()
                };

                await repository.AddAsync(sparepart);
                await repository.SaveChangesAsync();

                return Ok(new
                {
                    id = sparepart.Id,
                    name = sparepart.Name,
                    prize = sparepart.Prize,
                    purchasePrize = sparepart.PurchasePrize,
                    location = sparepart.Location,
                    balance = sparepart.Balance
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating sparepart: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateSparepart(string id, SparepartUpdateDto dto)
        {
            Console.WriteLine($"Looking for sparepart with id: {id}");
            var sparepart = await repository.GetByIdAsync(id);

            Console.WriteLine($"Sparepart found: {sparepart?.Name ?? "NULL"}");
            if (sparepart == null) return NotFound();

            sparepart = ConvertDtoSparepart(sparepart, dto);

            repository.Update(sparepart);
            await repository.SaveChangesAsync();

            return Ok(sparepart);
        }

        private Sparepart ConvertDtoSparepart(Sparepart sparepart, SparepartUpdateDto dto)
        {
            sparepart.Name = dto.Name;
            sparepart.PurchasePrize = dto.PurchasePrize;
            sparepart.Prize = dto.Prize;
            sparepart.Location = dto.Location;
            sparepart.Balance = dto.Balance;

            return sparepart;
        }

    }
}
