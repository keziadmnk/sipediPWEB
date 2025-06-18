const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");

const detailBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;

    const buku = await Buku.findByPk(nomor_isbn, {
       include: [
        { model: Kategori, as: 'kategori' },
        { model: Jenis, as: 'jenis' }
      ]
    });

    if (!buku) {
      return res.status(404).send("Buku tidak ditemukan");
    }

    res.render("mahasiswa/detailbuku", {buku});
  } catch (error) {
    console.error("Error fetching detail buku:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { detailBuku}
