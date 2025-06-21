const { Buku, Kategori } = require("../../models/relation");

const showDashboardMahasiswa = async (req, res) => {
  try {
    // Ambil buku rekomendasi (contoh: 6 buku terbaru atau dengan stok > 0)
    const bukuRekomendasi = await Buku.findAll({
      limit: 6,
      order: [['tahun_terbit', 'DESC']], // Contoh: ambil buku terbaru
      where: {
        jumlah_stok: { [require('sequelize').Op.gt]: 0 } // Hanya buku yang tersedia
      },
      include: [
        { model: Kategori, as: 'kategori' }
      ]
    });

    // Ambil semua kategori untuk bagian kategori dinamis
    const daftarKategori = await Kategori.findAll();

    res.render('mahasiswa/dashboard', {
      user: req.user, // Pastikan user object tetap tersedia
      bukuRekomendasi: bukuRekomendasi,
      categories: daftarKategori // Menggunakan nama 'categories' sesuai EJS yang Anda berikan
    });
  } catch (error) {
    console.error("Error fetching dashboard data for mahasiswa:", error);
    res.status(500).send("Terjadi kesalahan saat memuat dashboard.");
  }
};

module.exports = { showDashboardMahasiswa };