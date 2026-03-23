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

    }
}
