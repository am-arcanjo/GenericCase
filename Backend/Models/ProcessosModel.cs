using System;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class ProcessosModel
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public int AreaModelId { get; set; } 
        public AreaModel? Area { get; set; } 
        public List<SubprocessosModel>? Subprocessos { get; set; }
    }
}