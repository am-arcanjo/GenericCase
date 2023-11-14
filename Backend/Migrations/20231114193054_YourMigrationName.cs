using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseAPI.Migrations
{
    public partial class YourMigrationName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Processos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    AreaModelId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Processos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Processos_Areas_AreaModelId",
                        column: x => x.AreaModelId,
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subprocessos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: true),
                    ProcessosModelId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subprocessos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subprocessos_Processos_ProcessosModelId",
                        column: x => x.ProcessosModelId,
                        principalTable: "Processos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Processos_AreaModelId",
                table: "Processos",
                column: "AreaModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Subprocessos_ProcessosModelId",
                table: "Subprocessos",
                column: "ProcessosModelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Subprocessos");

            migrationBuilder.DropTable(
                name: "Processos");
        }
    }
}
