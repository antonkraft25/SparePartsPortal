using API.Data;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class PurchaseOrderController(
    IRepository<PurchaseOrder> repository,
    UserManager<User> userManager,
    AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult> GetAllPurchaseOrders([FromQuery] PaginationParams paginationParams)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var pagedPos = await context.PurchaseOrders
            .Include(po => po.Status)
            .Include(po => po.User)
            .Include(po => po.PoSpareparts)
                .ThenInclude(ps => ps.Sparepart)
            .OrderByDescending(po => po.Date)
            .ToPagedListAsync(paginationParams.PageNumber, paginationParams.PageSize);

        var result = new PagedList<PurchaseOrderDto>
        {
            TotalCount = pagedPos.TotalCount,
            PageNumber = pagedPos.PageNumber,
            PageSize = pagedPos.PageSize,
            Items = pagedPos.Items.Select(po => new PurchaseOrderDto
            {
                Id = po.Id,
                Date = po.Date,
                Status = po.Status.Name,
                UserName = $"{po.User.FirstName} {po.User.LastName}",
                Items = po.PoSpareparts.Select(ps => new PoItemResultDto
                {
                    SparepartId = ps.SparepartId,
                    SparepartName = ps.Sparepart.Name,
                    SparepartLocation = ps.Sparepart.Location,
                    Quantity = ps.Quantity,
                    QuantityReceived = ps.QuantityReceived
                }).ToList()
            }).ToList()
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseOrderDto>> GetPurchaseOrder(string id)
    {
        var po = await context.PurchaseOrders
            .Include(po => po.Status)
            .Include(po => po.User)
            .Include(po => po.PoSpareparts)
                .ThenInclude(ps => ps.Sparepart)
            .FirstOrDefaultAsync(po => po.Id == id);

        if (po == null) return NotFound();

        return Ok(new PurchaseOrderDto
        {
            Id = po.Id,
            Date = po.Date,
            Status = po.Status.Name,
            UserName = $"{po.User.FirstName} {po.User.LastName}",
            Items = po.PoSpareparts.Select(ps => new PoItemResultDto
            {
                SparepartId = ps.SparepartId,
                SparepartName = ps.Sparepart.Name,
                SparepartLocation = ps.Sparepart.Location,
                Quantity = ps.Quantity,
                QuantityReceived = ps.QuantityReceived
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult> CreatePurchaseOrder(PurchaseOrderCreateDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        if (dto.Items.Count == 0) return BadRequest("Inga reservdelar valda");

        var status = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Pending");
        if (status == null) return BadRequest("Status saknas");

        var po = new PurchaseOrder
        {
            Id = Guid.NewGuid().ToString(),
            Date = DateTime.UtcNow,
            UserId = user.Id,
            StatusId = status.Id,
            PoSpareparts = dto.Items.Select(item => new PoSparepart
            {
                PurchaseOrderId = Guid.NewGuid().ToString(),
                SparepartId = item.SparepartId,
                Quantity = item.Quantity
            }).ToList()
        };

        await repository.AddAsync(po);
        await repository.SaveChangesAsync();

        return Ok(new { id = po.Id });
    }

    [HttpPut("{id}/receive")]
    public async Task<ActionResult> ReceivePurchaseOrder(string id, List<PoItemDto> items)
    {
        var po = await context.PurchaseOrders
            .Include(po => po.PoSpareparts)
                .ThenInclude(ps => ps.Sparepart)
            .Include(po => po.Status)
            .FirstOrDefaultAsync(po => po.Id == id);

        if (po == null) return NotFound();

        foreach (var item in items)
        {
            var poSparepart = po.PoSpareparts
                .FirstOrDefault(ps => ps.SparepartId == item.SparepartId);

            if (poSparepart == null) continue;

            var quantityToReceive = Math.Min(item.Quantity, poSparepart.Quantity - poSparepart.QuantityReceived);
            poSparepart.QuantityReceived += quantityToReceive;
            poSparepart.Sparepart.Balance += quantityToReceive;
        }

        bool fullyReceived = po.PoSpareparts.All(ps => ps.QuantityReceived >= ps.Quantity);
        bool partiallyReceived = po.PoSpareparts.Any(ps => ps.QuantityReceived > 0);

        if (fullyReceived)
        {
            var deliveredStatus = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Delivered");
            if (deliveredStatus != null) po.StatusId = deliveredStatus.Id;
        }
        else if (partiallyReceived)
        {
            var partialStatus = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Partially Delivered");
            if (partialStatus != null) po.StatusId = partialStatus.Id;
        }

        await context.SaveChangesAsync();
        return Ok();
    }
}