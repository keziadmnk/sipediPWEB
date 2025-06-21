const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");
const sequelize = require('../../config/db');

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

const kembalikanBuku = async (req, res) => {
  const datatransaksi = await sequelize.transaction();
  try {
    const { id_peminjaman } = req.params;
    const peminjaman = await Peminjaman.findOne({
      where: { id_peminjaman: id_peminjaman, status_peminjaman: "Dipinjam" },
      transaction: datatransaksi,
    });

    if (!peminjaman) {
      await datatransaksi.rollback();
      return res.status(404).send("Peminjaman tidak ditemukan atau sudah dikembalikan");
    }

    const buku = await Buku.findOne({
        where: {nomor_isbn: peminjaman.nomor_isbn},
        transaction: datatransaksi
    })

    if (!buku) {
        await datatransaksi.rollback();
        return res.status(404).send("Buku tidak ditemukan");
    }

    // Increment book stock
    buku.jumlah_stok += 1;
    

    // Update loan status
    const tanggalWajibPengembalian = new Date(peminjaman.tanggal_wajib_pengembalian);
    const tanggalPengembalian = new Date();
    
    peminjaman.tanggal_pengembalian = tanggalPengembalian;

    if (tanggalPengembalian > tanggalWajibPengembalian) {
      peminjaman.status_peminjaman = 'Terlambat';
      
      // Perhitungan yang lebih akurat untuk selisih hari
      // Set kedua tanggal ke tengah malam untuk perhitungan yang akurat
      const wajibMidnight = new Date(tanggalWajibPengembalian);
      wajibMidnight.setHours(0, 0, 0, 0);
      
      const pengembalianMidnight = new Date(tanggalPengembalian);
      pengembalianMidnight.setHours(0, 0, 0, 0);
      
      const timeDiff = pengembalianMidnight.getTime() - wajibMidnight.getTime();
      const daysLate = timeDiff / (1000 * 3600 * 24);
      
      // Log untuk debugging
      console.log('Tanggal Wajib Pengembalian:', tanggalWajibPengembalian.toDateString());
      console.log('Tanggal Pengembalian:', tanggalPengembalian.toDateString());
      console.log('Wajib (midnight):', wajibMidnight.toDateString());
      console.log('Pengembalian (midnight):', pengembalianMidnight.toDateString());
      console.log('Selisih waktu (ms):', timeDiff);
      console.log('Hari keterlambatan:', daysLate);
      
      peminjaman.denda = daysLate * 5000; // Rp 5.000 per hari
      console.log('Total denda:', peminjaman.denda);
    } else {
      peminjaman.status_peminjaman = 'Dikembalikan';
    }

    await buku.save({ transaction: datatransaksi });
    await peminjaman.save({ transaction: datatransaksi });

    await datatransaksi.commit();

    res.redirect('/petugas/peminjaman');
  } catch (error) {
    await datatransaksi.rollback();
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { findAllPeminjaman, findDetailPeminjaman, kembalikanBuku };
