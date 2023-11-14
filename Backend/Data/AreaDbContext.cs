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
        public DbSet<ProcessosModel> Processos { get; set; }
        public DbSet<SubprocessosModel> Subprocessos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AreaModel>()
                .HasMany(a => a.Processos)
                .WithOne(p => p.Area)
                .HasForeignKey(p => p.AreaModelId);

            modelBuilder.Entity<ProcessosModel>()
                .HasMany(p => p.Subprocessos)
                .WithOne(s => s.Processos)
                .HasForeignKey(s => s.ProcessosModelId);
        }
    }
}

