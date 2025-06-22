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
          required: false, 
        },
        {
          model: Kategori,
          as: 'kategori',
          attributes: ["nama_kategori"],
          required: false, 
        },
      ],
      attributes: [
        "nomor_isbn",
        "judul_buku",
        "pengarang",
        "lokasi_penyimpanan",
        "jumlah_stok",
        "upload_sampul"
      ],
    });
        
    console.log("Data buku berhasil diambil:", databuku.length, "buku");

     
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
      jenis_buku = [] 
    } = req.body;

    
    const isEbook = jenis_buku.includes('E-Book');
    const isFisik = jenis_buku.includes('Buku Fisik');
    
    
    if (!jenis_buku || jenis_buku.length === 0) {
      jenis_buku = ['Buku Fisik'];
    }

    
    if (!judul_buku || !isbn || !pengarang || !penerbit || !tahun_terbit || !jumlah_halaman) {
      return res.status(400).json({
        success: false,
        message: "Judul, ISBN, Pengarang, Penerbit, Tahun Terbit, dan Jumlah Halaman adalah field wajib"
      });
    }

    
    if (isFisik) {
      if (!lokasi_penyimpanan || !jumlah_stok) {
        return res.status(400).json({
          success: false,
          message: "Lokasi penyimpanan dan jumlah stok wajib diisi untuk buku fisik"
        });
      }
    }

    
    if (isEbook) {
      if (!req.files?.upload_pdf?.[0]?.filename) {
        return res.status(400).json({
          success: false,
          message: "File PDF wajib diupload untuk e-book"
        });
      }
    }

    
    const existingBuku = await Buku.findByPk(isbn);
    if (existingBuku) {
      return res.status(400).json({
        success: false,
        message: "ISBN sudah terdaftar dalam sistem"
      });
    }

    
    let finalStok = 0;
    let finalLokasi = 'Digital';
    let finalPdf = null;
    
    if (isFisik) {
      finalStok = parseInt(jumlah_stok);
      finalLokasi = lokasi_penyimpanan;
    }
    
    
    if (isFisik && isEbook) {
      finalStok = parseInt(jumlah_stok);
      finalLokasi = lokasi_penyimpanan;
    }
    
    
    if (isEbook) {
      finalPdf = req.files?.upload_pdf?.[0]?.filename || null;
    } else {
      finalPdf = null; 
    }

    const bukuBaru = await Buku.create({
      nomor_isbn: isbn,
      judul_buku,
      pengarang,
      penerbit,
      tahun_terbit: parseInt(tahun_terbit),
      jumlah_halaman: parseInt(jumlah_halaman),
      jumlah_stok: finalStok,
      deskripsi,
      lokasi_penyimpanan: finalLokasi,
      id_kategori: kategori ? parseInt(kategori) : null,
      upload_pdf: finalPdf,
      upload_sampul: req.files?.upload_sampul?.[0]?.filename || null
    });

    
    if (jenis_buku && jenis_buku.length > 0) {
      
      const jenisIds = [];
      
      for (const jenisNama of jenis_buku) {
        let jenis = await Jenis.findOne({ where: { nama_jenis: jenisNama } });
        
        
        if (!jenis) {
          jenis = await Jenis.create({ nama_jenis: jenisNama });
        }
        
        jenisIds.push(jenis.id_jenis);
      }

      
      for (const jenisId of jenisIds) {
        await BukuJenis.create({
          nomor_isbn: isbn,
          id_jenis: jenisId
        });
      }
    }

    console.log("Buku berhasil ditambahkan:", bukuBaru.nomor_isbn);

    
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
    const { nomor_isbn } = req.params; 

    console.log("Mencoba menghapus buku dengan ISBN:", nomor_isbn);


    const databuku = await Buku.findByPk(nomor_isbn);

    if (!databuku) {
      console.log("Buku tidak ditemukan");
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan"
      });
    }

  
    const peminjamanAktif = await Peminjaman.findOne({
      where: { 
        nomor_isbn: nomor_isbn,
        status_peminjaman: 'Dipinjam' 
      }
    });

    if (peminjamanAktif) {
      console.log("Buku sedang dipinjam, tidak bisa dihapus");
      return res.status(400).json({
        success: false,
        message: "Buku tidak dapat dihapus karena sedang dipinjam"
      });
    }

   
    await BukuJenis.destroy({
      where: { nomor_isbn: nomor_isbn }
    });

    
    await databuku.destroy();

    console.log("Buku berhasil dihapus:", nomor_isbn);

    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({
        success: true,
        message: "Buku berhasil dihapus"
      });
    }

    
    req.session.message = {
      type: 'success',
      text: 'Buku berhasil dihapus!'
    };
    
    res.redirect('/admin/databuku');

  } catch (error) {
    console.error("Error menghapus buku:", error);
    
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus buku: " + error.message
      });
    }

    
    req.session.message = {
      type: 'error',
      text: 'Gagal menghapus buku: ' + error.message
    };
    
    res.redirect('/admin/databuku');
  }
};

const showEditBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;
    
    
    const databuku = await Buku.findByPk(nomor_isbn, {
      include: [
        { model: Kategori, as: "kategori" },
        { model: Jenis, as: "jenis" }
      ]
    });
    
    if (!databuku) {
      return res.status(404).send("Buku tidak ditemukan");
    }
    
    const kategori = await Kategori.findAll();
    
    const semuaJenis = await Jenis.findAll();
    
    res.render("admin/editbuku", { databuku, kategori, semuaJenis });
  } catch (error) {
    console.error("Error showEditBuku:", error);
    res.status(500).send("Internal Server Error");
  }
};


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

   
    const isEbook = jenis_buku.includes('E-Book');
    const isFisik = jenis_buku.includes('Buku Fisik');
    
    if (!jenis_buku || jenis_buku.length === 0) {
      jenis_buku = ['Buku Fisik'];
    }

  
    if (!judul_buku || !isbn || !pengarang || !penerbit || !tahun_terbit || !jumlah_halaman) {
      req.session.message = {
        type: 'error',
        text: 'Judul, ISBN, Pengarang, Penerbit, Tahun Terbit, dan Jumlah Halaman adalah field wajib'
      };
      return res.redirect(`/admin/editbuku/${nomor_isbn}`);
    }

  
    if (isFisik) {
      if (!lokasi_penyimpanan || !jumlah_stok) {
        req.session.message = {
          type: 'error',
          text: 'Lokasi penyimpanan dan jumlah stok wajib diisi untuk buku fisik'
        };
        return res.redirect(`/admin/editbuku/${nomor_isbn}`);
      }
    }

   
    const buku = await Buku.findByPk(nomor_isbn);
    if (!buku) {
      req.session.message = {
        type: 'error',
        text: 'Buku tidak ditemukan'
      };
      return res.redirect('/admin/databuku');
    }

   
    if (isEbook) {
      
      if (!req.files?.upload_pdf?.[0]?.filename && !buku.upload_pdf) {
        req.session.message = {
          type: 'error',
          text: 'File PDF wajib diupload untuk e-book'
        };
        return res.redirect(`/admin/editbuku/${nomor_isbn}`);
      }
    }

  
    let finalStok = 0;
    let finalLokasi = 'Digital';
    let finalPdf = null;
    
    if (isFisik) {
      finalStok = parseInt(jumlah_stok);
      finalLokasi = lokasi_penyimpanan;
    }
    
   
    if (isFisik && isEbook) {
      finalStok = parseInt(jumlah_stok);
      finalLokasi = lokasi_penyimpanan;
    }
    
   
    if (isEbook) {
      finalPdf = req.files?.upload_pdf?.[0]?.filename || buku.upload_pdf;
    } else {
      finalPdf = null; 
    }

    await buku.update({
      nomor_isbn: isbn, 
      judul_buku,
      pengarang,
      penerbit,
      tahun_terbit: parseInt(tahun_terbit),
      jumlah_halaman: parseInt(jumlah_halaman),
      jumlah_stok: finalStok,
      deskripsi,
      lokasi_penyimpanan: finalLokasi,
      id_kategori: kategori ? parseInt(kategori) : null,
      upload_pdf: finalPdf,
      upload_sampul: req.files?.upload_sampul?.[0]?.filename || buku.upload_sampul
    });

   
    await BukuJenis.destroy({ where: { nomor_isbn: nomor_isbn } });
    
    
    if (jenis_buku && jenis_buku.length > 0) {
      const jenisIds = [];
      
      for (const jenisNama of Array.isArray(jenis_buku) ? jenis_buku : [jenis_buku]) {
        let jenis = await Jenis.findOne({ where: { nama_jenis: jenisNama } });
        
        
        if (!jenis) {
          jenis = await Jenis.create({ nama_jenis: jenisNama });
        }
        
        jenisIds.push(jenis.id_jenis);
      }

      
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