using Microsoft.AspNetCore.Mvc;
using CaseAPI.Data;
using CaseAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
        public async Task<IActionResult> PutArea(int id, AreaModel updatedArea)
        {
            var area = await _context.Areas
                .Include(a => a.Processos)
                .ThenInclude(p => p.Subprocessos)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (area == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(updatedArea.Nome))
            {
                area.Nome = updatedArea.Nome;
            }

            if (!string.IsNullOrWhiteSpace(updatedArea.Descricao))
            {
                area.Descricao = updatedArea.Descricao;
            }

            if (updatedArea.Processos != null)
            {
                foreach (var updatedProcesso in updatedArea.Processos)
                {
                    var existingProcesso = area.Processos.FirstOrDefault(p => p.Id == updatedProcesso.Id);
                    if (existingProcesso != null)
                    {
                        existingProcesso.Nome = updatedProcesso.Nome;

                        if (updatedProcesso.Subprocessos != null)
                        {
                            foreach (var updatedSubprocesso in updatedProcesso.Subprocessos)
                            {
                                var existingSubprocesso = existingProcesso.Subprocessos.FirstOrDefault(s => s.Id == updatedSubprocesso.Id);
                                if (existingSubprocesso != null)
                                {
                                    existingSubprocesso.Nome = updatedSubprocesso.Nome;
                                }
                            }
                        }
                    }
                }
            }

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

        [HttpGet("processos/{id}")]
        public async Task<ActionResult<ProcessosModel>> GetProcesso(int id)
        {
            var processo = await _context.Processos.FindAsync(id);

            if (processo == null)
            {
                return NotFound();
            }

            return Ok(processo);
        }


        [HttpPost("processos/{areaId}")]
        public async Task<ActionResult<ProcessosModel>> PostProcesso(ProcessosModel processo, int areaId)
        {

            var newProcesso = new ProcessosModel
            {
                Nome = processo.Nome,
                AreaModelId = areaId,
                Subprocessos = processo.Subprocessos
            };

            try
            {
                var existingProcess = await _context.Processos.FindAsync(processo.Id);
                if (existingProcess == null)
                {
                    _context.Processos.Add(newProcesso);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction(nameof(GetProcesso), new { id = newProcesso.Id }, newProcesso);
                }
                else
                {
                    foreach (var newSubprocesso in processo.Subprocessos)
                    {
                        existingProcess.Subprocessos.Add(new SubprocessosModel
                        {
                            Nome = newSubprocesso.Nome,
                            ProcessosModelId = existingProcess.Id
                        });
                    }

                    _context.Entry(existingProcess).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    var addedSubprocessos = await _context.Subprocessos
                        .Where(s => s.ProcessosModelId == existingProcess.Id &&
                               processo.Subprocessos.Any(newSubprocesso => newSubprocesso.Nome == s.Nome))
                        .ToListAsync();

                    return Ok(addedSubprocessos);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostProcesso: {ex}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("subprocessos/{processoId}")]
        public async Task<ActionResult<SubprocessosModel>> PostSubprocesso(SubprocessosModel subprocesso, int processoId)
        {
            var newSubprocesso = new SubprocessosModel
            {
                Nome = subprocesso.Nome,
                ProcessosModelId = processoId,
            };

            try
            {
                _context.Subprocessos.Add(newSubprocesso);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSubprocesso), new { id = newSubprocesso.Id }, newSubprocesso);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostSubprocesso: {ex}");
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("subprocessos/{id}")]
        public async Task<ActionResult<SubprocessosModel>> GetSubprocesso(int id)
        {
            var subprocesso = await _context.Subprocessos.FindAsync(id);

            if (subprocesso == null)
            {
                return NotFound();
            }

            return Ok(subprocesso);
        }


    }
}


