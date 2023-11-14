using System;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class SubprocessosModel
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public int ProcessosModelId { get; set; } 
        public ProcessosModel? Processos { get; set; } 
    }
}