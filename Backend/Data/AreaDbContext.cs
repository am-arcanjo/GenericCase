using System;
using Microsoft.EntityFrameworkCore;
using CaseAPI.Models;


namespace CaseAPI.Data
{
    public class AreaDbContext : DbContext
    {
        public AreaDbContext(DbContextOptions<AreaDbContext> options) : base(options)
        {
        }

        public DbSet<AreaModel> Areas { get; set; }
    }
}
