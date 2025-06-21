const { Peminjaman } = require("../../models/PeminjamanModel");
const { Buku } = require("../../models/BukuModel");
const { Pengguna } = require("../../models/PenggunaModel");
const PDFDocument = require('pdfkit');

// Menampilkan form peminjaman dengan data buku yang dipilih
const showFormPeminjaman = async (req, res) => {
  try {
    const { nomor_isbn } = req.query;

    console.log("Request user:", req.user); // Debug log
    console.log("ISBN:", nomor_isbn); // Debug log

    if (!nomor_isbn) {
      return res.status(400).send("ISBN buku tidak ditemukan");
    }

    // Ambil data buku berdasarkan ISBN
    const buku = await Buku.findOne({
      where: { nomor_isbn: nomor_isbn },
    });

    if (!buku) {
      return res.status(404).send("Buku tidak ditemukan");
    }

    // Cek apakah user data tersedia
    if (!req.user) {
      return res.status(401).send("User tidak terautentikasi");
    }

    // Cek berbagai kemungkinan nama field untuk id pengguna
    const userId = req.user.userId;

    console.log("User ID:", userId); // Debug log

    if (!userId) {
      return res.status(400).send("ID pengguna tidak ditemukan dalam session");
    }

    // Ambil data pengguna yang sedang login
    const pengguna = await Pengguna.findOne({
      where: { id_pengguna: userId },
    });

    if (!pengguna) {
      return res.status(404).send("Data pengguna tidak ditemukan di database");
    }

    // Render form peminjaman dengan data buku dan pengguna
    res.render("mahasiswa/formpeminjaman", {
      buku: buku,
      pengguna: pengguna,
      user: req.user,
    });
  } catch (error) {
    console.error("Error showing form peminjaman:", error);
    console.error("Full error:", error);
    res.status(500).send("Terjadi kesalahan sistem: " + error.message);
  }
};

// Memproses peminjaman buku
const prosesPeminjaman = async (req, res) => {
  try {
    // Log untuk debugging
    console.log("Raw request body:", req.body);
    console.log("Request user:", req.user);

    // Ambil data dari body
    const { nomor_isbn, tanggal_peminjaman } = req.body;

    // Cek berbagai kemungkinan nama field untuk id pengguna
    const id_pengguna = req.user.userId;

    console.log("Process peminjaman - User ID:", id_pengguna);
    console.log("Process peminjaman - nomor_isbn:", nomor_isbn);
    console.log("Process peminjaman - tanggal_peminjaman:", tanggal_peminjaman);

    // Validasi input
    if (!nomor_isbn || !tanggal_peminjaman) {
      return res.status(400).json({
        success: false,
        message: `Data tidak lengkap. nomor_isbn: ${nomor_isbn}, tanggal_peminjaman: ${tanggal_peminjaman}`,
      });
    }

    if (!id_pengguna) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Validasi tanggal peminjaman tidak boleh sebelum hari ini
    const today = new Date();
    const pinjamDate = new Date(tanggal_peminjaman);

    // Reset time untuk perbandingan tanggal saja
    today.setHours(0, 0, 0, 0);
    pinjamDate.setHours(0, 0, 0, 0);

    if (pinjamDate < today) {
      return res.status(400).json({
        success: false,
        message: "Tanggal peminjaman tidak boleh sebelum hari ini",
      });
    }

    // Cek apakah buku masih tersedia
    const buku = await Buku.findOne({
      where: { nomor_isbn: nomor_isbn },
    });

    if (!buku) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan",
      });
    }

    if (buku.jumlah_stok <= 0) {
      return res.status(400).json({
        success: false,
        message: "Stok buku habis",
      });
    }

    // Cek apakah mahasiswa sudah meminjam buku yang sama dan belum dikembalikan
    const existingPeminjaman = await Peminjaman.findOne({
      where: {
        id_pengguna: id_pengguna,
        nomor_isbn: nomor_isbn,
        status_peminjaman: "Dipinjam",
      },
    });

    if (existingPeminjaman) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah meminjam buku ini dan belum mengembalikannya",
      });
    }

    // Hitung tanggal wajib pengembalian (3 hari setelah tanggal peminjaman)
    const tanggalWajibPengembalian = new Date(pinjamDate);
    tanggalWajibPengembalian.setDate(tanggalWajibPengembalian.getDate() + 3);

    // Buat record peminjaman baru
    const peminjaman = await Peminjaman.create({
      id_pengguna: id_pengguna,
      nomor_isbn: nomor_isbn,
      tanggal_peminjaman: pinjamDate,
      tanggal_wajib_pengembalian: tanggalWajibPengembalian,
      status_peminjaman: "Dipinjam",
      denda: null,
    });

    // Kurangi stok buku
    await Buku.update(
      { jumlah_stok: buku.jumlah_stok - 1 },
      { where: { nomor_isbn: nomor_isbn } }
    );

    // Format tanggal untuk response
    const formatTanggal = (date) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Response dengan URL redirect ke halaman bukti peminjaman
    res.json({
      success: true,
      message: "Peminjaman berhasil diproses",
      redirect_url: `/mahasiswa/buktipeminjaman?id_peminjaman=${peminjaman.id_peminjaman}`,
      data: {
        id_peminjaman: peminjaman.id_peminjaman,
        tanggal_wajib_pengembalian: formatTanggal(tanggalWajibPengembalian),
      },
    });
  } catch (error) {
    console.error("Error processing peminjaman:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan sistem: " + error.message,
    });
  }
};

// Menampilkan halaman bukti peminjaman
const showBuktiPeminjaman = async (req, res) => {
  try {
    const { id_peminjaman } = req.query;

    if (!id_peminjaman) {
      return res.status(400).send("ID peminjaman tidak ditemukan");
    }

    // Cari data peminjaman berdasarkan ID dengan relasi ke buku dan pengguna
    // Gunakan nama model tanpa alias karena tidak ada alias yang didefinisikan di relation.js
    const peminjaman = await Peminjaman.findOne({
      where: { id_peminjaman: id_peminjaman },
      include: [
        {
          model: Buku,
          // Tidak menggunakan alias karena tidak didefinisikan di relation.js
          required: true,
        },
        {
          model: Pengguna,
          // Tidak menggunakan alias karena tidak didefinisikan di relation.js
          required: true,
        },
      ],
    });

    if (!peminjaman) {
      return res.status(404).send("Data peminjaman tidak ditemukan");
    }

    // Format tanggal
    const formatTanggal = (date) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Prepare data dengan format tanggal yang sudah diformat
    // Akses data relasi menggunakan nama model (Buku dan Pengguna)
    const peminjamanData = {
      ...peminjaman.dataValues,
      tanggal_peminjaman: formatTanggal(peminjaman.tanggal_peminjaman),
      tanggal_wajib_pengembalian: formatTanggal(
        peminjaman.tanggal_wajib_pengembalian
      ),
      // Akses menggunakan nama model dengan huruf kapital
      buku: peminjaman.Buku,
      pengguna: peminjaman.Pengguna,
      // Jika tidak ada lokasi_penyimpanan di peminjaman, ambil dari buku
      lokasi_penyimpanan:
        peminjaman.lokasi_penyimpanan || peminjaman.Buku.lokasi_penyimpanan,
    };

    console.log("Peminjaman data:", peminjamanData); // Debug log

    // Render halaman bukti dengan data peminjaman
    res.render("mahasiswa/buktipeminjaman", {
      peminjaman: peminjamanData,
    });
  } catch (error) {
    console.error("Error showing bukti peminjaman:", error);
    res.status(500).send("Terjadi kesalahan sistem: " + error.message);
  }
};

const downloadBuktiPeminjaman = async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    const peminjaman = await Peminjaman.findOne({
      where: { id_peminjaman: id_peminjaman },
      include: [{ model: Buku, required: true }, { model: Pengguna, required: true }],
    });

    if (!peminjaman) {
      return res.status(404).send("Data peminjaman tidak ditemukan");
    }
    
    const peminjamanData = peminjaman.get({ plain: true });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="bukti-peminjaman-${id_peminjaman}.pdf"`);

    doc.pipe(res);

    // Header
    doc
      .fontSize(20).font('Helvetica-Bold').text('Bukti Peminjaman', { align: 'center' })
      .fontSize(12).font('Helvetica').text('Sistem Informasi Perpustakaan Digital (SIPEDI)', { align: 'center' })
      .text('Universitas Andalas', { align: 'center' })
      .moveDown(2);

    // Kode Peminjaman Box
    const boxY = doc.y;
    doc
      .fontSize(14).font('Helvetica-Bold').text('Kode Peminjaman Anda:', 70, boxY + 22, { align: 'left'})
      .fontSize(20).font('Helvetica-Bold').text(String(peminjamanData.id_peminjaman), 70, boxY + 20, { align: 'right', width: 452 });
    
    doc.rect(50, boxY, 512, 60).stroke();
    doc.moveDown(4);

    // Helper function to draw a section
    const drawSection = (title, data) => {
      doc.fontSize(16).font('Helvetica-Bold').text(title, { underline: true }).moveDown(0.5);
      Object.entries(data).forEach(([key, value]) => {
        const textValue = String(value || '-');
        doc.fontSize(11).font('Helvetica-Bold').text(key + ':', { continued: true, width: 150 })
           .font('Helvetica').text(textValue)
           .moveDown(0.5);
      });
      doc.moveDown(1);
    };

    // Format tanggal function
    const formatTanggal = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    // Informasi Peminjam
    drawSection('Informasi Peminjam', {
      'Nama Lengkap': peminjamanData.Pengguna.nama_lengkap,
      'NIM': peminjamanData.id_pengguna,
      'Email': peminjamanData.Pengguna.email
    });

    // Informasi Buku
    drawSection('Informasi Buku', {
      'Judul Buku': peminjamanData.Buku.judul_buku,
      'Pengarang': peminjamanData.Buku.pengarang,
      'Nomor ISBN': peminjamanData.nomor_isbn,
      'Lokasi': peminjamanData.Buku.lokasi_penyimpanan
    });

    // Detail Peminjaman
    drawSection('Detail Peminjaman', {
      'Tanggal Pinjam': formatTanggal(peminjamanData.tanggal_peminjaman),
      'Wajib Kembali': formatTanggal(peminjamanData.tanggal_wajib_pengembalian),
      'Status': peminjamanData.status_peminjaman,
    });
    
    // Footer
    doc.fontSize(9).font('Helvetica-Oblique')
      .text('Harap tunjukkan bukti ini kepada petugas perpustakaan saat pengambilan buku.', 50, 750, { align: 'center', width: 512 })
      .text(`Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}.`, { align: 'center', width: 512 });

    doc.end();

  } catch (error) {
    console.error("Error downloading bukti peminjaman:", error);
    res.status(500).send("Terjadi kesalahan saat mengunduh bukti peminjaman: " + error.message);
  }
};

module.exports = {
  showFormPeminjaman,
  prosesPeminjaman,
  showBuktiPeminjaman,
  downloadBuktiPeminjaman,
};
