// controllers/BukuController.js
const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");

const findAllBuku = async (req, res) => {
  try {
    const databuku = await Buku.findAll({
      include: [
        {
          model: Jenis,
          attributes: ["nama_jenis"], // Mengambil jenis buku
        },
        {
          model: Kategori,
          attributes: ["nama_kategori"], // Mengambil kategori buku
        },
      ],
      attributes: [
        "nomor_isbn", 
        "judul_buku", 
        "pengarang", 
        "lokasi_penyimpanan", 
        "jumlah_stok", // Atribut buku yang ingin ditampilkan
      ],
    });
    console.log(databuku);
    // Kirim data ke tampilan 'admin/databuku'
    res.render('admin/databuku', { databuku });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data buku:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = findAllBuku;
