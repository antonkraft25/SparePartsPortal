using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrderController(
    IRepository<Order> repository,
    IRepository<DeliveryAddress> addressRepository,
    UserManager<User> userManager,
    AppDbContext context) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateOrder(OrderCreateDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        if (dto.Items.Count == 0) return BadRequest("Varukorgen är tom");

        var status = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Pending");
        if (status == null) return BadRequest("Status saknas");

        var deliveryAddress = new DeliveryAddress
        {
            Id = Guid.NewGuid().ToString(),
            StreetName = dto.DeliveryAddress.StreetName,
            City = dto.DeliveryAddress.City,
            Postalcode = dto.DeliveryAddress.Postalcode
        };

        await addressRepository.AddAsync(deliveryAddress);
        await addressRepository.SaveChangesAsync();

        var order = new Order
        {
            Id = Guid.NewGuid().ToString(),
            OrderDate = DateTime.UtcNow,
            DeliveryAddressId = deliveryAddress.Id,
            StatusId = status.Id,
            UserId = user.Id,
            OrderSpareparts = dto.Items.Select(item => new OrderSparepart
            {
                OrderId = Guid.NewGuid().ToString(),
                SparepartId = item.SparepartId,
                Quantity = item.Quantity
            }).ToList()
        };

        await repository.AddAsync(order);
        await repository.SaveChangesAsync();

        return Ok(new { id = order.Id });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        var orders = await context.Orders
            .Include(o => o.Status)
            .Include(o => o.DeliveryAddress)
            .Include(o => o.User)
            .Include(o => o.OrderSpareparts)
                .ThenInclude(os => os.Sparepart)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderDate = o.OrderDate,
            Status = o.Status.Name,
            UserName = $"{o.User.FirstName} {o.User.LastName}",
            DeliveryAddress = new DeliveryAddressDto
            {
                StreetName = o.DeliveryAddress.StreetName,
                City = o.DeliveryAddress.City,
                Postalcode = o.DeliveryAddress.Postalcode
            },
            Items = o.OrderSpareparts.Select(os => new OrderItemResultDto
            {
                SparepartId = os.SparepartId,
                SparepartName = os.Sparepart.Name,
                Quantity = os.Quantity
            }).ToList()
        }));
    }
}