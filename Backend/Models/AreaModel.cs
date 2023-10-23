using System;
using Microsoft.EntityFrameworkCore;

namespace CaseAPI.Models

{
    public class AreaModel
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
    }
}