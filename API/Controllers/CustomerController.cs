using API.DTOs;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CustomerController(IRepository<Customer> repository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAllCustomers()
        {
            var customers = await repository.GetAllAsync();
            return Ok(customers.Select(c => new
            {
                id = c.Id,
                name = c.Name,
                city = c.City,
                postalcode = c.Postalcode,
                streetName = c.StreetName
            }));
        }

        [HttpPost]
        public async Task<ActionResult> CreateCustomer(CustomerCreateDto dto)
        {
            var customer = new Customer
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name,
                City = dto.City,
                Postalcode = dto.Postalcode,
                StreetName = dto.StreetName
            };

            await repository.AddAsync(customer);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                id = customer.Id,
                name = customer.Name,
                city = customer.City,
                postalcode = customer.Postalcode,
                streetName = customer.StreetName
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomer(string id, CustomerUpdateDto dto)
        {
            var customer = await repository.GetByIdAsync(id);

            if (customer == null) return NotFound();

            customer.Name = dto.Name;
            customer.City = dto.City;
            customer.Postalcode = dto.Postalcode;
            customer.StreetName = dto.StreetName;

            repository.Update(customer);
            await repository.SaveChangesAsync();

            return Ok(new
            {
                id = customer.Id,
                name = customer.Name,
                city = customer.City,
                postalcode = customer.Postalcode,
                streetName = customer.StreetName
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCustomer(string id)
        {
            var customer = await repository.GetByIdAsync(id);
            if (customer == null) return NotFound();
            return Ok(new
            {
                id = customer.Id,
                name = customer.Name,
                city = customer.City,
                postalcode = customer.Postalcode,
                streetName = customer.StreetName
            });
        }
    }
}
