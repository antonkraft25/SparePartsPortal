namespace API.DTOs;

public class OrderCreateDto
{
    public required DeliveryAddressDto DeliveryAddress { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
}

public class DeliveryAddressDto
{
    public required string StreetName { get; set; }
    public required string City { get; set; }
    public required string Postalcode { get; set; }
}

public class OrderItemDto
{
    public required string SparepartId { get; set; }
    public int Quantity { get; set; }
}
