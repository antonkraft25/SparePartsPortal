using System;
using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Repositories;

public class SparepartsRepository<T>  : Repository<T> where T : Sparepart
{
    private readonly AppDbContext _context;
    public SparepartsRepository(AppDbContext context) : base(context)
    {
        _context = context;
    } 
}
