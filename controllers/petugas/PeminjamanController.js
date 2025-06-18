const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");



const findAllPeminjaman = async (req, res) => {
  try {
    const datapeminjaman = await Peminjaman.findAll({
      where: {
        status_peminjaman: "Dipinjam",
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
    res.render("petugas/peminjaman", { datapeminjaman });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findDetailPeminjaman = async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    const datapeminjaman = await Peminjaman.findOne({
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
    if (!datapeminjaman) {
      return res.status(404).send("Peminjaman tidak ditemukan");
    }
    console.log(datapeminjaman);
    res.render("petugas/detailpeminjaman", { datapeminjaman });
  } catch (error) {
    console.error("Error fetching detail peminjaman:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { findAllPeminjaman, findDetailPeminjaman };
