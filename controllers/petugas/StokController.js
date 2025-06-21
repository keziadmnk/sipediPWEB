// controllers/petugas/StokController.js

const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Sequelize, Op } = require("sequelize");

// Fungsi helper untuk mengambil data stok buku
const fetchStokData = async () => {
  const daftarBuku = await Buku.findAll({
    attributes: [
      "nomor_isbn",
      "judul_buku",
      "jumlah_stok",
    ],
  });

  const stokData = [];
  let no = 1;

  for (const buku of daftarBuku) {
    const stokDipinjam = await Peminjaman.count({
      where: {
        nomor_isbn: buku.nomor_isbn,
        status_peminjaman: "Dipinjam",
      },
    });

    const totalStok = buku.jumlah_stok + stokDipinjam;

    let statusInfo = {
      icon: "fas fa-check-circle",
      color: "text-green-500",
      message: "Normal",
    };
    if (buku.jumlah_stok <= 5 && buku.jumlah_stok > 0) {
      statusInfo = {
        icon: "fas fa-exclamation-triangle",
        color: "text-orange-500",
        message: "Menipis",
      };
    } else if (buku.jumlah_stok <= 0) {
      statusInfo = {
        icon: "fas fa-times-circle",
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
  return stokData;
};


// Fungsi untuk menampilkan halaman stok buku fisik (sama seperti sebelumnya, tapi pakai fetchStokData)
const getStokBukuFisik = async (req, res) => {
  try {
    const stokData = await fetchStokData(); // Ambil data menggunakan helper

    res.render('petugas/stokbuku', { stokData });

  } catch (error) {
    console.error("Error fetching stok buku fisik:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};

// FUNGSI BARU: Untuk mencetak laporan stok buku fisik
const printStokBukuFisik = async (req, res) => {
  try {
    const stokData = await fetchStokData(); // Ambil data menggunakan helper yang sama

    // Render tampilan khusus cetak
    res.render('petugas/printstokbuku', { stokData });

  } catch (error) {
    console.error("Error generating print report for stok buku fisik:", error);
    res.status(500).send("Server Error: " + error.message);
  }
};


module.exports = {
  getStokBukuFisik,
  printStokBukuFisik, // Ekspor fungsi baru
};