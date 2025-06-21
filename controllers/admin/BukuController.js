const { BukuJenis } = require("../../models/BukuJenisModel");
const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");
const { Peminjaman } = require("../../models/PeminjamanModel");

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

const showDetailBukuAdmin = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;

    const databuku = await Buku.findByPk(nomor_isbn, {
      include: [
        { model: Kategori, as: "kategori" },
        { model: Jenis, as: "jenis" }
      ]
    });

    if (!databuku) return res.status(404).send("Buku tidak ditemukan");

    res.render("admin/detailbuku", { databuku});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const hapusBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params; // Ambil nomor ISBN dari parameter URL

    console.log("Mencoba menghapus buku dengan ISBN:", nomor_isbn);

    // Cari buku berdasarkan nomor ISBN
    const databuku = await Buku.findByPk(nomor_isbn);

    if (!databuku) {
      console.log("Buku tidak ditemukan");
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan"
      });
    }

    // Cek apakah buku sedang dipinjam
    const peminjamanAktif = await Peminjaman.findOne({
      where: { 
        nomor_isbn: nomor_isbn,
        // Tambahkan kondisi untuk peminjaman yang belum dikembalikan
        // Sesuaikan dengan struktur tabel peminjaman Anda
        // status_peminjaman: 'dipinjam' // Contoh jika ada kolom status
      }
    });

    if (peminjamanAktif) {
      console.log("Buku sedang dipinjam, tidak bisa dihapus");
      return res.status(400).json({
        success: false,
        message: "Buku tidak dapat dihapus karena sedang dipinjam"
      });
    }

    // Hapus relasi di tabel BukuJenis terlebih dahulu (many-to-many)
    await BukuJenis.destroy({
      where: { nomor_isbn: nomor_isbn }
    });

    // Hapus buku dari database
    await databuku.destroy();

    console.log("Buku berhasil dihapus:", nomor_isbn);

    // Jika request dari AJAX, kirim response JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({
        success: true,
        message: "Buku berhasil dihapus"
      });
    }

    // Jika request biasa, redirect dengan pesan sukses
    req.session.message = {
      type: 'success',
      text: 'Buku berhasil dihapus!'
    };
    
    res.redirect('/admin/databuku');

  } catch (error) {
    console.error("Error menghapus buku:", error);
    
    // Jika request dari AJAX, kirim error JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus buku: " + error.message
      });
    }

    // Jika request biasa, redirect dengan pesan error
    req.session.message = {
      type: 'error',
      text: 'Gagal menghapus buku: ' + error.message
    };
    
    res.redirect('/admin/databuku');
  }
};

// Tampilkan form edit buku
const showEditBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;
    
    // Ambil data buku beserta relasi
    const databuku = await Buku.findByPk(nomor_isbn, {
      include: [
        { model: Kategori, as: "kategori" },
        { model: Jenis, as: "jenis" }
      ]
    });
    
    if (!databuku) {
      return res.status(404).send("Buku tidak ditemukan");
    }
    
    // Ambil semua kategori untuk dropdown
    const kategori = await Kategori.findAll();
    
    // Ambil semua jenis untuk checkbox
    const semuaJenis = await Jenis.findAll();
    
    res.render("admin/editbuku", { databuku, kategori, semuaJenis });
  } catch (error) {
    console.error("Error showEditBuku:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Proses update buku
const updateBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;
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
      jenis_buku = []
    } = req.body;

    // Validasi data required
    if (!judul_buku || !isbn || !pengarang || !penerbit || !tahun_terbit || !jumlah_halaman || !jumlah_stok) {
      req.session.message = {
        type: 'error',
        text: 'Semua field wajib harus diisi'
      };
      return res.redirect(`/admin/editbuku/${nomor_isbn}`);
    }

    // Cari buku lama
    const buku = await Buku.findByPk(nomor_isbn);
    if (!buku) {
      req.session.message = {
        type: 'error',
        text: 'Buku tidak ditemukan'
      };
      return res.redirect('/admin/databuku');
    }

    // Update data buku
    await buku.update({
      nomor_isbn: isbn, // jika ingin bisa update ISBN
      judul_buku,
      pengarang,
      penerbit,
      tahun_terbit: parseInt(tahun_terbit),
      jumlah_halaman: parseInt(jumlah_halaman),
      jumlah_stok: parseInt(jumlah_stok),
      deskripsi,
      lokasi_penyimpanan,
      id_kategori: kategori ? parseInt(kategori) : null,
      // File upload - gunakan file baru jika ada, jika tidak gunakan yang lama
      upload_pdf: req.files?.upload_pdf?.[0]?.filename || buku.upload_pdf,
      upload_sampul: req.files?.upload_sampul?.[0]?.filename || buku.upload_sampul
    });

    // Update relasi jenis (many-to-many)
    // 1. Hapus semua relasi lama
    await BukuJenis.destroy({ where: { nomor_isbn: nomor_isbn } });
    
    // 2. Tambahkan relasi baru
    if (jenis_buku && jenis_buku.length > 0) {
      const jenisIds = [];
      
      for (const jenisNama of Array.isArray(jenis_buku) ? jenis_buku : [jenis_buku]) {
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

    req.session.message = {
      type: 'success',
      text: 'Buku berhasil diupdate!'
    };
    
    res.redirect('/admin/databuku');
  } catch (error) {
    console.error("Error updateBuku:", error);
    
    req.session.message = {
      type: 'error',
      text: 'Gagal update buku: ' + error.message
    };
    
    res.redirect(`/admin/editbuku/${req.params.nomor_isbn}`);
  }
};

module.exports = {
  findAllBuku,
  tambahBuku,
  showDetailBukuAdmin,
  hapusBuku,
  showEditBuku,
  updateBuku
};