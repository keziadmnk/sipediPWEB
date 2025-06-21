const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");
const { Buku } = require("../../models/BukuModel");
const { Op } = require("sequelize");

const showLaporanAdmin = async (req, res) => {
  try {
    const { dari_tanggal, sampai_tanggal } = req.query;
    
    // Buat kondisi where untuk filter tanggal
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

    // Ambil data peminjaman dengan relasi ke pengguna dan buku
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

    // Update status peminjaman berdasarkan tanggal wajib pengembalian
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let peminjaman of dataPeminjaman) {
      const tanggalWajib = new Date(peminjaman.tanggal_wajib_pengembalian);
      tanggalWajib.setHours(0, 0, 0, 0);

      // Jika status masih "Dipinjam" dan sudah melewati tanggal wajib pengembalian
      if (peminjaman.status_peminjaman === "Dipinjam" && today > tanggalWajib) {
        // Hitung denda (Rp 1.000 per hari)
        const selisihHari = Math.ceil((today - tanggalWajib) / (1000 * 60 * 60 * 24));
        const denda = selisihHari * 1000;

        // Update status dan denda di database
        await Peminjaman.update(
          {
            status_peminjaman: "Terlambat",
            denda: denda
          },
          {
            where: { id_peminjaman: peminjaman.id_peminjaman }
          }
        );

        // Update data di array untuk ditampilkan
        peminjaman.status_peminjaman = "Terlambat";
        peminjaman.denda = denda;
      }
    }

    // Render halaman dengan data
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