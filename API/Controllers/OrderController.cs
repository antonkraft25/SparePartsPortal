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
        var user = await userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);
        var isTekniker = roles.Contains("Tekniker");

        var query = context.Orders
            .Include(o => o.Status)
            .Include(o => o.DeliveryAddress)
            .Include(o => o.User)
            .Include(o => o.OrderSpareparts)
                .ThenInclude(os => os.Sparepart)
            .OrderByDescending(o => o.OrderDate)
            .AsQueryable();

        if (isTekniker)
            query = query.Where(o => o.UserId == user.Id);

        var orders = await query.ToListAsync();

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
                SparepartLocation = os.Sparepart.Location,
                Quantity = os.Quantity,
                QuantitySent = os.QuantitySent
            }).ToList()
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(string id)
    {
        var order = await context.Orders
            .Include(o => o.Status)
            .Include(o => o.DeliveryAddress)
            .Include(o => o.User)
            .Include(o => o.OrderSpareparts)
                .ThenInclude(os => os.Sparepart)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        return Ok(new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            Status = order.Status.Name,
            UserName = $"{order.User.FirstName} {order.User.LastName}",
            DeliveryAddress = new DeliveryAddressDto
            {
                StreetName = order.DeliveryAddress.StreetName,
                City = order.DeliveryAddress.City,
                Postalcode = order.DeliveryAddress.Postalcode
            },
            Items = order.OrderSpareparts.Select(os => new OrderItemResultDto
            {
                SparepartId = os.SparepartId,
                SparepartName = os.Sparepart.Name,
                SparepartLocation = os.Sparepart.Location,
                Quantity = os.Quantity,
                QuantitySent = os.QuantitySent
            }).ToList()
        });
    }

    [HttpPut("{id}/ship")]
    public async Task<ActionResult> ShipOrder(string id, List<OrderItemDto> items)
    {
        var order = await context.Orders
            .Include(o => o.OrderSpareparts)
                .ThenInclude(os => os.Sparepart)
            .Include(o => o.Status)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        foreach (var item in items)
        {
            var orderSparepart = order.OrderSpareparts
                .FirstOrDefault(os => os.SparepartId == item.SparepartId);

            if (orderSparepart == null) continue;

            var quantityToSend = Math.Min(item.Quantity, orderSparepart.Quantity - orderSparepart.QuantitySent);
            orderSparepart.QuantitySent += quantityToSend;
            orderSparepart.Sparepart.Balance -= quantityToSend;
        }

        bool fullyShipped = order.OrderSpareparts.All(os => os.QuantitySent >= os.Quantity);
        bool partiallyShipped = order.OrderSpareparts.Any(os => os.QuantitySent > 0);

        if (fullyShipped)
        {
            var deliveredStatus = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Delivered");
            if (deliveredStatus != null) order.StatusId = deliveredStatus.Id;
        }
        else if (partiallyShipped)
        {
            var partialStatus = await context.Statuses.FirstOrDefaultAsync(s => s.Name == "Partially Delivered");
            if (partialStatus != null) order.StatusId = partialStatus.Id;
        }

        await context.SaveChangesAsync();
        return Ok();
    }
}