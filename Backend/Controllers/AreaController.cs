using Microsoft.AspNetCore.Mvc;
using CaseAPI.Data;
using CaseAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace CaseAPI.Controllers
{
    [Route("api/area")]
    [ApiController]
    public class AreaController : ControllerBase
    {
        private readonly AreaDbContext _context;

        public AreaController(AreaDbContext context)
        {
            _context = context;
        }

        [HttpOptions()] 
        public IActionResult PreflightResponse()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*"); 
            Response.Headers.Add("Access-Control-Allow-Headers", "content-type"); 
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
            return Ok();
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<AreaModel>>> GetAreas()
        {
            var areas = await _context.Areas.ToListAsync();
            return Ok(areas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AreaModel>> GetArea(int id)
        {
            var area = await _context.Areas
                .Include(a => a.Processos)
                    .ThenInclude(p => p.Subprocessos)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (area == null)
            {
                return NotFound();
            }

            var areaModel = new AreaModel
            {
                Id = area.Id,
                Nome = area.Nome,
                Descricao = area.Descricao,
                Processos = area.Processos.Select(p => new ProcessosModel
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Subprocessos = p.Subprocessos.Select(s => new SubprocessosModel
                    {
                        Id = s.Id,
                        Nome = s.Nome,
                    }).ToList(),
                }).ToList(),
            };

            return Ok(areaModel);
        }



        [HttpPost]
        public async Task<ActionResult<AreaModel>> PostArea(AreaModel area)
        {
            _context.Areas.Add(area);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArea), new { id = area.Id }, area);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutArea(int id, AreaModel area)
        {
            if (id != area.Id)
            {
                return BadRequest();
            }

            _context.Entry(area).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AreaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArea(int id)
        {
            var area = await _context.Areas.FindAsync(id);

            if (area == null)
            {
                return NotFound();
            }

            _context.Areas.Remove(area);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AreaExists(int id)
        {
            return _context.Areas.Any(e => e.Id == id);
        }
    }
}


