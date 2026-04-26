namespace API.DTOs;

public class OrderDto
{
    public required string Id { get; set; }
    public required DateTime OrderDate { get; set; }
    public required string Status { get; set; }
    public required string UserName { get; set; }
    public required DeliveryAddressDto DeliveryAddress { get; set; }
    public List<OrderItemResultDto> Items { get; set; } = [];
}

public class OrderItemResultDto
{
    public required string SparepartId { get; set; }
    public required string SparepartName { get; set; }
    public required string SparepartLocation { get; set; }
    public int Quantity { get; set; }
    public int QuantitySent { get; set; }
}