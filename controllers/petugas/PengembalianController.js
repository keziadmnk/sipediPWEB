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

const findDetailPengembalian = async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    const datapengembalian = await Peminjaman.findOne({
      where: { id_peminjaman: id_peminjaman },
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap", "email"],
        },
        {
          model: Buku,
          attributes: ["nomor_isbn", "judul_buku", "pengarang", "lokasi_penyimpanan"],
        },
      ],
    });
    if (!datapengembalian) {
      return res.status(404).send("Peminjaman tidak ditemukan");
    }
    console.log(datapengembalian);
    res.render("petugas/detailpengembalian", { datapengembalian });
  } catch (error) {
    console.error("Error fetching detail pengembalian:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { findAllPengembalian, findDetailPengembalian } ;
