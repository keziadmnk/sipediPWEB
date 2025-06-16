const { Sequelize } = require("sequelize");
const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");

const findAllPengembalian = async (req, res) => {
  try {
    const datapengembalian = await Peminjaman.findAll({
      where: {
        status_peminjaman: {
          [Sequelize.Op.or]: ["Dikembalikan", "Terlambat"],
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

    res.render("petugas/pengembalian", { datapengembalian });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = findAllPengembalian;
