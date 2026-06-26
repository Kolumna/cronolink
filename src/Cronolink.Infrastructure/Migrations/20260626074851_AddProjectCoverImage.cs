using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cronolink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectCoverImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "CoverImage",
                table: "projects",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverImageContentType",
                table: "projects",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImage",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "CoverImageContentType",
                table: "projects");
        }
    }
}
