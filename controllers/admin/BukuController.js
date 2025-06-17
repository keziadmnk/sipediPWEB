// controllers/admin/BukuController.js
const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");

const findAllBuku = async (req, res) => {
  try {
    console.log("Mencoba mengambil data buku...");
    
    const databuku = await Buku.findAll({
      include: [
        {
          model: Jenis,
          attributes: ["nama_jenis"],
          required: false, // LEFT JOIN - tidak wajib ada jenis
        },
        {
          model: Kategori,
          attributes: ["nama_kategori"],
          required: false, // LEFT JOIN - tidak wajib ada kategori
        },
      ],
      attributes: [
        "nomor_isbn",
        "judul_buku",
        "pengarang",
        "lokasi_penyimpanan",
        "jumlah_stok",
      ],
    });
    
    console.log("Data buku berhasil diambil:", databuku.length, "buku");
    
    // Kirim data ke tampilan 'admin/databuku'
    res.render('admin/databuku', { databuku });
    
  } catch (error) {
    console.error("Error detail:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Coba ambil data tanpa include jika error
    try {
      console.log("Mencoba mengambil data tanpa relasi...");
      const databuku = await Buku.findAll({
        attributes: [
          "nomor_isbn",
          "judul_buku",
          "pengarang",
          "lokasi_penyimpanan",
          "jumlah_stok",
        ],
      });
      
      console.log("Data buku tanpa relasi berhasil:", databuku.length, "buku");
      res.render('admin/databuku', { databuku });
      
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      res.status(500).json({ 
        message: "Terjadi kesalahan pada server",
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};



module.exports = findAllBuku;