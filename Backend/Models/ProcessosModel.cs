using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class ProcessosModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Nome { get; set; }
        public int AreaModelId { get; set; } 
        public AreaModel? Area { get; set; } 
        public List<SubprocessosModel>? Subprocessos { get; set; }
    }
}