using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class AreaModel
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public List<ProcessosModel>? Processos { get; set; }
    }
}