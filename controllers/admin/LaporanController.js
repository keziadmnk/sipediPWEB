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

      
      if (peminjaman.status_peminjaman === "Dipinjam" && today > tanggalWajib) {
        const selisihHari = Math.ceil((today - tanggalWajib) / (5000 * 60 * 60 * 24));
        const denda = selisihHari * 5000;

      
        await Peminjaman.update(
          {
            status_peminjaman: "Terlambat",
            denda: denda
          },
          {
            where: { id_peminjaman: peminjaman.id_peminjaman }
          }
        );

       
        peminjaman.status_peminjaman = "Terlambat";
        peminjaman.denda = denda;
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