using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using CaseAPI.Data;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AreaDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteConnection"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

