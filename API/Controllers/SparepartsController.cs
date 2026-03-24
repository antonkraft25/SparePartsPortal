using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SparepartsController (IRepository<Sparepart> repository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sparepart>>> GetAllSpareparts()
        {
            return Ok(await repository.GetAllAsync());
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
