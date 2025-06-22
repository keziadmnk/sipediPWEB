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
const { showLaporanAdmin } = require("../controllers/admin/LaporanController");

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
  res.render('admin/detailbuku'); 
});


router.get("/detailbuku/:nomor_isbn", showDetailBukuAdmin);

router.post("/tambahkategori", tambahKategori);

router.get("/kategori", findAllKategori);

router.get("/editkategori/:id_kategori", showEditKategoriForm); 

router.post("/editkategori/:id_kategori", updateKategori); 

router.post("/deletekategori/:id_kategori", deleteKategori);

router.get("/databuku", findAllBuku);

router.get("/tambahbuku", showTambahBuku);

router.delete('/buku/:nomor_isbn', authenticate, hapusBuku);

router.post('/hapusbuku/:nomor_isbn', authenticate, hapusBuku);



router.post(
  "/tambahbuku",
  uploadFields, 
  tambahBuku
);

router.get("/datamahasiswa", authenticate, findAllMahasiswa);

router.get("/datapetugas", authenticate, findAllPetugas);

router.get("/tambahpetugas", authenticate, (req, res) => {
  res.render("admin/tambahpetugas");
});

router.post("/tambahpetugas", authenticate, tambahPetugas);

router.get('/tambahmahasiswa', authenticate, showTambahMahasiswaForm); 
router.post('/tambahmahasiswa', authenticate, tambahMahasiswa); 

router.get('/editbuku/:nomor_isbn', authenticate, showEditBuku);
router.post('/editbuku/:nomor_isbn', authenticate, uploadFields, updateBuku);

router.get('/editpetugas/:id_pengguna', authenticate, showEditPetugas);
router.post('/editpetugas/:id_pengguna', authenticate, updatePetugas);

router.get('/editmahasiswa/:id_pengguna', authenticate, showEditMahasiswa);
router.post('/editmahasiswa/:id_pengguna', authenticate, updateMahasiswa);

router.post('/hapuspetugas/:id_pengguna', authenticate, hapusPetugas);

router.post('/hapusmahasiswa/:id_pengguna', authenticate, hapusMahasiswa);

router.get("/laporanadmin", authenticate, showLaporanAdmin);

module.exports = router;