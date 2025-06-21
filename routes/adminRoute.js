const express = require("express");
var router = express.Router();

const {
  tambahKategori,
  findAllKategori,
  showTambahBuku,
  showKatalogBuku,
} = require("../controllers/admin/KategoriController");
const { authenticate } = require("../middlewares/authenticate");
const {
  findAllBuku,
  tambahBuku,
  showDetailBukuAdmin,
  hapusBuku,
  showEditBuku,
  updateBuku
} = require("../controllers/admin/BukuController");

// Import upload middleware
const { uploadFields } = require("../middlewares/upload");
const { findAllMahasiswa, showTambahMahasiswaForm, tambahMahasiswa } = require("../controllers/admin/MahasiswaController");
const { findAllPetugas, tambahPetugas, hapusPetugas } = require("../controllers/admin/PetugasController");

// const adminController = require('../controllers/admin/adminController');

router.get("/dashboard", authenticate, (req, res) => {
  res.render("admin/dashboard");
});

router.get('/editbuku', authenticate, (req, res) => {
  res.render('admin/editbuku'); 
});

router.get("/tambahkategori", function (req, res, next) {
  res.render("admin/tambahkategori");
});

router.get('/detailbuku', authenticate, function(req, res, next) {
  res.render('admin/detailbuku'); // Pastikan ada file EJS untuk profil mahasiswa
});


router.get("/detailbuku/:nomor_isbn", showDetailBukuAdmin);

router.post("/tambahkategori", tambahKategori);

router.get("/kategori", findAllKategori);

router.get("/databuku", findAllBuku);

router.get("/tambahbuku", showTambahBuku);

// Route untuk menghapus buku - perbaiki route path
router.delete('/buku/:nomor_isbn', authenticate, hapusBuku);

// Alternative route jika ingin menggunakan POST method
router.post('/hapusbuku/:nomor_isbn', authenticate, hapusBuku);



router.post(
  "/tambahbuku",
  uploadFields, // Gunakan middleware upload
  tambahBuku
);

router.get("/datamahasiswa", authenticate, findAllMahasiswa);

router.get("/datapetugas", authenticate, findAllPetugas);

router.get("/tambahpetugas", authenticate, (req, res) => {
  res.render("admin/tambahpetugas");
});

router.post("/tambahpetugas", authenticate, tambahPetugas);

router.get('/tambahmahasiswa', authenticate, showTambahMahasiswaForm); // Route to show the add student form
router.post('/tambahmahasiswa', authenticate, tambahMahasiswa); // Route to process the add student form submission

// Route edit buku
router.get('/editbuku/:nomor_isbn', authenticate, showEditBuku);
router.post('/editbuku/:nomor_isbn', authenticate, uploadFields, updateBuku);

router.post('/hapuspetugas/:id_pengguna', authenticate, hapusPetugas);

module.exports = router;