const { Buku, Kategori } = require("../../models/relation");

const showDashboardMahasiswa = async (req, res) => {
  try {
    const bukuRekomendasi = await Buku.findAll({
      limit: 6,
      order: [['tahun_terbit', 'DESC']], 
      where: {
        jumlah_stok: { [require('sequelize').Op.gt]: 0 } 
      },
      include: [
        { model: Kategori, as: 'kategori' }
      ]
    });

    const daftarKategori = await Kategori.findAll();

    res.render('mahasiswa/dashboard', {
      user: req.user, 
      bukuRekomendasi: bukuRekomendasi,
      categories: daftarKategori 
    });
  } catch (error) {
    console.error("Error fetching dashboard data for mahasiswa:", error);
    res.status(500).send("Terjadi kesalahan saat memuat dashboard.");
  }
};

module.exports = { showDashboardMahasiswa };