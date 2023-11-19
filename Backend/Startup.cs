using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using CaseAPI.Data;
using CaseAPI.Models;
using CaseAPI.Controllers;
using System.Text.Json.Serialization;
using Serilog;
using Microsoft.Extensions.Logging;

namespace CaseAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AreaDbContext>(options =>
            {
                options.UseSqlite(Configuration.GetConnectionString("SQLiteConnection"));
            });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            Log.Logger = new LoggerConfiguration()
                        .WriteTo.File("Logs/mylog.txt", rollingInterval: RollingInterval.Day)
                        .CreateLogger();

            services.AddLogging(builder =>
            {
                builder.AddSerilog();
            });

            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers(); 
                endpoints.MapFallbackToController("Lobby", "Home", "Index");
            });
        }
    }
}

