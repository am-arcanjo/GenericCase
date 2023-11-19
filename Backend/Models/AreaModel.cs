using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class AreaModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public List<ProcessosModel>? Processos { get; set; }
    }
}