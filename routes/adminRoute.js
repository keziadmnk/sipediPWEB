const express = require("express");
var router = express.Router();

const {
  tambahKategori,
  findAllKategori,
  showTambahBuku,
  showKatalogBuku,
  showEditKategoriForm, 
  updateKategori,   
  deleteKategori,   

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
const { findAllMahasiswa, showTambahMahasiswaForm, tambahMahasiswa, showEditMahasiswa, updateMahasiswa, hapusMahasiswa } = require("../controllers/admin/MahasiswaController");
const { findAllPetugas, tambahPetugas, showEditPetugas, updatePetugas, hapusPetugas } = require("../controllers/admin/PetugasController");
const { showDashboardAdmin, showProfilAdmin } = require("../controllers/admin/dashboardcontroller");

// const adminController = require('../controllers/admin/adminController');

router.get("/dashboard", authenticate, showDashboardAdmin);

// Route untuk profil admin
router.get("/profil", authenticate, showProfilAdmin);

router.get("/tambahkategori", function (req, res, next) {
  res.render("admin/tambahkategori");
});

router.get('/editbuku', authenticate, (req, res) => {
  res.render('admin/editbuku'); 
});

router.get('/detailbuku', authenticate, function(req, res, next) {
  res.render('admin/detailbuku'); // Pastikan ada file EJS untuk profil mahasiswa
});


router.get("/detailbuku/:nomor_isbn", showDetailBukuAdmin);

router.post("/tambahkategori", tambahKategori);

router.get("/kategori", findAllKategori);

// Rute BARU untuk menampilkan form edit kategori
router.get("/editkategori/:id_kategori", showEditKategoriForm); // id_kategori dari parameter

// Rute BARU untuk memproses update kategori
router.post("/editkategori/:id_kategori", updateKategori); // id_kategori dari parameter

router.post("/deletekategori/:id_kategori", deleteKategori);

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

// Route edit petugas
router.get('/editpetugas/:id_pengguna', authenticate, showEditPetugas);
router.post('/editpetugas/:id_pengguna', authenticate, updatePetugas);

// Route edit mahasiswa
router.get('/editmahasiswa/:id_pengguna', authenticate, showEditMahasiswa);
router.post('/editmahasiswa/:id_pengguna', authenticate, updateMahasiswa);

router.post('/hapuspetugas/:id_pengguna', authenticate, hapusPetugas);

router.post('/hapusmahasiswa/:id_pengguna', authenticate, hapusMahasiswa);

module.exports = router;