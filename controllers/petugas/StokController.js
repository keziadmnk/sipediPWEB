// controllers/petugas/StokController.js

const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Sequelize, Op } = require("sequelize");

const getStokBukuFisik = async (req, res) => {
  try {
    // Ambil semua buku
    const daftarBuku = await Buku.findAll({
      attributes: [
        "nomor_isbn",
        "judul_buku",
        "jumlah_stok", // Ini adalah Stok Tersedia
      ],
      // Filter hanya buku fisik (asumsi jika ada jenis e-book, mereka tidak masuk stok fisik)
      // Ini bisa lebih kompleks jika ada model Jenis dan relasi di Buku
      // Untuk saat ini, asumsikan semua buku dihitung stoknya jika tidak ada filter jenis.
      // Jika Anda hanya ingin buku fisik, pastikan ada cara untuk membedakannya di model Buku,
      // misalnya melalui join dengan tabel Jenis jika sudah ada relasi untuk itu.
    });

    const stokData = [];
    let no = 1;

    for (const buku of daftarBuku) {
      // Hitung jumlah buku yang sedang dipinjam
      const stokDipinjam = await Peminjaman.count({
        where: {
          nomor_isbn: buku.nomor_isbn,
          status_peminjaman: "Dipinjam",
        },
      });

      const totalStok = buku.jumlah_stok + stokDipinjam; // Total stok = Tersedia + Dipinjam

      // Tentukan status berdasarkan Stok Tersedia
      let statusInfo = {
        icon: "fas fa-check-circle", // Default: tersedia
        color: "text-green-500",
        message: "Normal",
      };
      if (buku.jumlah_stok <= 5 && buku.jumlah_stok > 0) {
        statusInfo = {
          icon: "fas fa-exclamation-triangle", // Warning: stok menipis
          color: "text-orange-500",
          message: "Menipis",
        };
      } else if (buku.jumlah_stok <= 0) {
        statusInfo = {
          icon: "fas fa-times-circle", // Danger: habis
          color: "text-red-500",
          message: "Habis",
        };
      }

      stokData.push({
        no: no++,
        isbn: buku.nomor_isbn,
        judul_buku: buku.judul_buku,
        stok_tersedia: buku.jumlah_stok,
        stok_dipinjam: stokDipinjam,
        total_stok: totalStok,
        status: statusInfo,
      });
    }

    res.render('petugas/stokbuku', { stokData });

  } catch (error) {
    console.error("Error fetching stok buku fisik:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};

module.exports = {
  getStokBukuFisik,
};