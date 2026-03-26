using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAuthorizationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Authorizations_AuthorizationId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Authorizations");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AuthorizationId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AuthorizationId",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorizationId",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Authorizations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authorizations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AuthorizationId",
                table: "AspNetUsers",
                column: "AuthorizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Authorizations_AuthorizationId",
                table: "AspNetUsers",
                column: "AuthorizationId",
                principalTable: "Authorizations",
                principalColumn: "Id");
        }
    }
}
