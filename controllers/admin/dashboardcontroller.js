const { Op } = require("sequelize");
const { Peminjaman } = require("../../models/PeminjamanModel");

const findStatusStatistik = async (req, res) => {
  try {
    const totalpeminjaman = await Peminjaman.count();
    const totaldipinjam = await Peminjaman.count({
      where: { status_peminjaman: "Dipinjam" },
    });
    const totaldikembalikan = await Peminjaman.count({
  where: {
    status_peminjaman: {
      [Op.or]: ["Dikembalikan", "Terlambat"]
    },
    tanggal_pengembalian: {
      [Op.ne]: null // sudah ada tanggal pengembalian
    }
  }
});

    const totalterlambat = await Peminjaman.count({
      where: { status_peminjaman: "Terlambat" },
    });
    res.render("petugas/dashboard", {
      totalpeminjaman,
      totaldipinjam,
      totaldikembalikan,
      totalterlambat,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { findStatusStatistik }