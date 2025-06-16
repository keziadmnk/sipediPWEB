const { Sequelize } = require("sequelize");
const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");

const findAllDenda = async (req, res) => {
  try {
    const datadenda = await Peminjaman.findAll({
      where: {
        status_peminjaman: "Terlambat", 
        denda: {
          [Sequelize.Op.gt]: 0, 
        },
      },

      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap"],
        },
        {
          model: Buku,
          attributes: ["nomor_isbn", "judul_buku"],
        },
      ],
    });

    res.render("petugas/denda", { datadenda });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = findAllDenda;
