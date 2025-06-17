// const { Buku } = require('../../models/BukuModel');
// const { BukuKategori } = require('../../models/BukuKategoriModel');
// const { BukuJenis } = require('../../models/BukuJenisModel');
// const { Kategori } = require('../../models/KategoriModel');
// const { Jenis } = require('../../models/JenisModel');
// const sequelize = require('../../config/db');

// const showTambahBuku = async (req, res) => {
//     try {
//         // Ambil data kategori dan jenis untuk dropdown
//         const kategoris = await Kategori.findAll({
//             order: [['nama_kategori', 'ASC']]
//         });
        
//         const jenises = await Jenis.findAll({
//             order: [['nama_jenis', 'ASC']]
//         });

//         res.render('admin/tambahbuku', { 
//             kategoris, 
//             jenises,
//             success: req.query.success,
//             error: req.query.error
//         });
//     } catch (error) {
//         console.error('Error loading form:', error);
//         res.status(500).send('Error loading form');
//     }
// };

// const tambahBuku = async (req, res) => {
//     const transaction = await sequelize.transaction();
    
//     try {
//         console.log(req.body); 
//         console.log(req.files); 

//         const {
//             isbn,
//             judul_buku,
//             pengarang,
//             penerbit,
//             tahun_terbit,
//             deskripsi,
//             jumlah_halaman,
//             jumlah_stok,
//             lokasi_penyimpanan,
//             kategori,
//             jenis_buku
//         } = req.body;

//         // Validasi input required
//         if (!isbn || !judul_buku || !pengarang || !penerbit || !tahun_terbit) {
//             await transaction.rollback();
//             return res.redirect('/admin/tambahbuku?error=Data wajib harus diisi');
//         }

//         // Cek apakah ISBN sudah ada
//         const existingBook = await Buku.findByPk(isbn);
//         if (existingBook) {
//             await transaction.rollback();
//             return res.redirect('/admin/tambahbuku?error=ISBN sudah terdaftar');
//         }

//         // Path file yang diupload
//         let upload_pdf = null;
//         let upload_sampul = null;

//         if (req.files) {
//             if (req.files['upload_pdf']) {
//                 upload_pdf = req.files['upload_pdf'][0].filename;
//             }
//             if (req.files['upload_sampul']) {
//                 upload_sampul = req.files['upload_sampul'][0].filename;
//             }
//         }

//         // 1. Insert data buku utama
//         await Buku.create({
//             nomor_isbn: isbn,
//             judul_buku: judul_buku,
//             pengarang: pengarang,
//             penerbit: penerbit,
//             tahun_terbit: parseInt(tahun_terbit),
//             deskripsi: deskripsi || '',
//             jumlah_halaman: parseInt(jumlah_halaman) || 0,
//             jumlah_stok: parseInt(jumlah_stok) || 0,
//             lokasi_penyimpanan: lokasi_penyimpanan || '',
//             upload_pdf: upload_pdf,
//             upload_sampul: upload_sampul
//         }, { transaction });

//         // 2. Insert relasi buku-kategori
//         if (kategori) {
//             // Cari ID kategori berdasarkan nama
//             const kategoriData = await Kategori.findOne({
//                 where: { nama_kategori: kategori }
//             });
            
//             if (kategoriData) {
//                 await BukuKategori.create({
//                     nomor_isbn: isbn,
//                     id_kategori: kategoriData.id_kategori
//                 }, { transaction });
//             }
//         }

//         // 3. Insert relasi buku-jenis
//         if (jenis_buku) {
//             // Jika jenis_buku adalah array (multiple checkbox)
//             const jenisArray = Array.isArray(jenis_buku) ? jenis_buku : [jenis_buku];
            
//             for (const jenisNama of jenisArray) {
//                 // Cari ID jenis berdasarkan nama
//                 const jenisData = await Jenis.findOne({
//                     where: { nama_jenis: jenisNama }
//                 });
                
//                 if (jenisData) {
//                     await BukuJenis.create({
//                         nomor_isbn: isbn,
//                         id_jenis: jenisData.id_jenis.toString() // Convert ke string sesuai model BukuJenis
//                     }, { transaction });
//                 }
//             }
//         }

//         // Commit transaction jika semua berhasil
//         await transaction.commit();
        
//         res.redirect('/admin/tambahbuku?success=Buku berhasil ditambahkan');
        
//     } catch (error) {
//         // Rollback jika ada error
//         await transaction.rollback();
//         console.error('Error adding book:', error);
        
//         // Hapus file yang sudah diupload jika ada error
//         if (req.files) {
//             const fs = require('fs');
//             if (req.files['upload_pdf']) {
//                 fs.unlinkSync(req.files['upload_pdf'][0].path);
//             }
//             if (req.files['upload_sampul']) {
//                 fs.unlinkSync(req.files['upload_sampul'][0].path);
//             }
//         }
        
//         res.redirect('/admin/tambahbuku?error=Gagal menambahkan buku: ' + error.message);
//     }
// };

// module.exports = { showTambahBuku, tambahBuku};