// controllers/admin/BukuController.js
// const { Buku, Jenis, Kategori, BukuJenis } = require("../../models");

const { BukuJenis } = require("../../models/BukuJenisModel");
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
          as: 'jenis',
          attributes: ["nama_jenis"],
          required: false, // LEFT JOIN - tidak wajib ada jenis
        },
        {
          model: Kategori,
          as: 'kategori',
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

     // Debug: Log data untuk melihat struktur
    if (databuku.length > 0) {
      console.log("Sample data:", JSON.stringify(databuku[0], null, 2));
    }
        
    res.render('admin/databuku', { databuku });
      
  } catch (error) {
    console.error("Error detail:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

const tambahBuku = async (req, res) => {
  try {
    const {
      judul_buku,
      isbn,
      pengarang,
      penerbit,
      tahun_terbit,
      jumlah_halaman,
      lokasi_penyimpanan,
      jumlah_stok,
      deskripsi,
      kategori,
      jenis_buku = [] // Default array kosong jika tidak ada checkbox dipilih
    } = req.body;

    // Validasi data required
    if (!judul_buku || !isbn || !pengarang || !penerbit || !tahun_terbit || !jumlah_halaman || !jumlah_stok) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib harus diisi"
      });
    }

    // Cek apakah ISBN sudah ada
    const existingBuku = await Buku.findByPk(isbn);
    if (existingBuku) {
      return res.status(400).json({
        success: false,
        message: "ISBN sudah terdaftar dalam sistem"
      });
    }

    // Buat buku baru
    const bukuBaru = await Buku.create({
      nomor_isbn: isbn,
      judul_buku,
      pengarang,
      penerbit,
      tahun_terbit: parseInt(tahun_terbit),
      jumlah_halaman: parseInt(jumlah_halaman),
      jumlah_stok: parseInt(jumlah_stok),
      deskripsi,
      lokasi_penyimpanan,
      id_kategori: kategori ? parseInt(kategori) : null,
      upload_pdf: req.files?.upload_pdf?.[0]?.filename || null,
      upload_sampul: req.files?.upload_sampul?.[0]?.filename || null
    });

    // Tambahkan relasi dengan jenis (many-to-many)
    if (jenis_buku && jenis_buku.length > 0) {
      // Konversi string jenis ke ID jenis
      const jenisIds = [];
      
      for (const jenisNama of jenis_buku) {
        let jenis = await Jenis.findOne({ where: { nama_jenis: jenisNama } });
        
        // Jika jenis belum ada, buat jenis baru
        if (!jenis) {
          jenis = await Jenis.create({ nama_jenis: jenisNama });
        }
        
        jenisIds.push(jenis.id_jenis);
      }

      // Tambahkan ke tabel junction
      for (const jenisId of jenisIds) {
        await BukuJenis.create({
          nomor_isbn: isbn,
          id_jenis: jenisId
        });
      }
    }

    console.log("Buku berhasil ditambahkan:", bukuBaru.nomor_isbn);

    // Redirect ke halaman data buku dengan pesan sukses
    req.session.message = {
      type: 'success',
      text: 'Buku berhasil ditambahkan!'
    };
    
    res.redirect('/admin/databuku');

  } catch (error) {
    console.error("Error menambahkan buku:", error);
    
    req.session.message = {
      type: 'error',
      text: 'Gagal menambahkan buku: ' + error.message
    };
    
    res.redirect('/admin/tambahbuku');
  }
};

module.exports = {
  findAllBuku,
  tambahBuku
};