const { Buku, Jenis, BukuJenis } = require('../models/relation'); // Sesuaikan path

module.exports = {
  showAll: async (req, res) => {
    const list = await Buku.findAll({
      include: [{ model: Jenis, through: BukuJenis }]
    });
    res.render('databuku', { bukuList: list });
  },

  showForm: async (req, res) => {
    const jenisList = await Jenis.findAll();
    res.render('tambahbuku', { jenisList });
  },

  create: async (req, res) => {
    const {
      nomor_isbn, judul_buku, pengarang, penerbit,
      tahun_terbit, jumlah_halaman,
      jumlah_stok, lokasi_penyimpanan, deskripsi
    } = req.body;
    const jenis = Array.isArray(req.body.jenis_buku)
      ? req.body.jenis_buku
      : [req.body.jenis_buku];

    const buku = await Buku.create({
      nomor_isbn, judul_buku, pengarang, penerbit,
      tahun_terbit, jumlah_halaman,
      jumlah_stok, lokasi_penyimpanan, deskripsi
    });

    await buku.addJenisBuku(jenis); // Sequelize otomatis buat entri di BukuJenis

    res.redirect('/buku');
  }
};
