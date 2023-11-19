﻿// <auto-generated />
using CaseAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CaseAPI.Migrations
{
    [DbContext(typeof(AreaDbContext))]
    [Migration("20231119151743_UpdateProcessosandSubprocessosModel")]
    partial class UpdateProcessosandSubprocessosModel
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.0");

            modelBuilder.Entity("CaseAPI.Models.AreaModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Descricao")
                        .HasColumnType("TEXT");

                    b.Property<string>("Nome")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Areas");
                });

            modelBuilder.Entity("CaseAPI.Models.ProcessosModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AreaModelId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Nome")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("AreaModelId");

                    b.ToTable("Processos");
                });

            modelBuilder.Entity("CaseAPI.Models.SubprocessosModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Nome")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProcessosModelId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ProcessosModelId");

                    b.ToTable("Subprocessos");
                });

            modelBuilder.Entity("CaseAPI.Models.ProcessosModel", b =>
                {
                    b.HasOne("CaseAPI.Models.AreaModel", "Area")
                        .WithMany("Processos")
                        .HasForeignKey("AreaModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Area");
                });

            modelBuilder.Entity("CaseAPI.Models.SubprocessosModel", b =>
                {
                    b.HasOne("CaseAPI.Models.ProcessosModel", "Processos")
                        .WithMany("Subprocessos")
                        .HasForeignKey("ProcessosModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Processos");
                });

            modelBuilder.Entity("CaseAPI.Models.AreaModel", b =>
                {
                    b.Navigation("Processos");
                });

            modelBuilder.Entity("CaseAPI.Models.ProcessosModel", b =>
                {
                    b.Navigation("Subprocessos");
                });
#pragma warning restore 612, 618
        }
    }
}