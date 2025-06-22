const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");
const { Buku } = require("../../models/BukuModel");
const { Op } = require("sequelize");

const showLaporanAdmin = async (req, res) => {
  try {
    const { dari_tanggal, sampai_tanggal } = req.query;
    
   
    let whereCondition = {};
    
    if (dari_tanggal && sampai_tanggal) {
      whereCondition = {
        tanggal_peminjaman: {
          [Op.between]: [new Date(dari_tanggal), new Date(sampai_tanggal)]
        }
      };
    } else if (dari_tanggal) {
      whereCondition = {
        tanggal_peminjaman: {
          [Op.gte]: new Date(dari_tanggal)
        }
      };
    } else if (sampai_tanggal) {
      whereCondition = {
        tanggal_peminjaman: {
          [Op.lte]: new Date(sampai_tanggal)
        }
      };
    }

    const dataPeminjaman = await Peminjaman.findAll({
      where: whereCondition,
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap"],
          required: true
        },
        {
          model: Buku,
          attributes: ["nomor_isbn", "judul_buku"],
          required: true
        }
      ],
      order: [["tanggal_peminjaman", "DESC"]]
    });

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let peminjaman of dataPeminjaman) {
      const tanggalWajib = new Date(peminjaman.tanggal_wajib_pengembalian);
      tanggalWajib.setHours(0, 0, 0, 0);

      // Jika tidak ada tanggal pengembalian, status HARUS "Dipinjam" (tidak pernah "Terlambat")
      if (!peminjaman.tanggal_pengembalian) {
        // Jika status di database "Terlambat" tapi tidak ada tanggal pengembalian, ini anomali
        // Perbaiki dengan mengembalikan ke status "Dipinjam"
        if (peminjaman.status_peminjaman === "Terlambat") {
          peminjaman.status_peminjaman = "Dipinjam";
          // Update database untuk memperbaiki anomali
          await Peminjaman.update(
            { status_peminjaman: "Dipinjam" },
            { where: { id_peminjaman: peminjaman.id_peminjaman } }
          );
        }
        
        // Jika status "Dipinjam" dan sudah lewat batas waktu, hitung denda untuk ditampilkan
        if (peminjaman.status_peminjaman === "Dipinjam" && today > tanggalWajib) {
          const selisihHari = Math.ceil((today - tanggalWajib) / (1000 * 60 * 60 * 24));
          const denda = selisihHari * 5000;

          // JANGAN ubah status di database, hanya tambahkan denda untuk ditampilkan
          peminjaman.dendaDisplay = denda; // Denda untuk ditampilkan saja
          peminjaman.isTerlambat = true; // Flag untuk menandai keterlambatan
        } else {
          peminjaman.dendaDisplay = 0;
          peminjaman.isTerlambat = false;
        }
      } else {
        // Jika ada tanggal pengembalian, gunakan status dan denda dari database
        peminjaman.dendaDisplay = peminjaman.denda || 0;
        peminjaman.isTerlambat = false;
      }
    }

    
    res.render("admin/laporanadmin", {
      dataPeminjaman: dataPeminjaman,
      filters: {
        dari_tanggal: dari_tanggal || "",
        sampai_tanggal: sampai_tanggal || ""
      }
    });

  } catch (error) {
    console.error("Error loading laporan admin:", error);
    res.status(500).send("Terjadi kesalahan saat memuat laporan");
  }
};

module.exports = {
  showLaporanAdmin
}; 