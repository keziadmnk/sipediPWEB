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
} = require("../controllers/admin/BukuController");
// Import upload middleware
const { uploadFields } = require("../middlewares/upload");

router.get("/dashboard", authenticate, (req, res) => {
  res.render("admin/dashboard");
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

router.delete('/admin/buku/:nomor_isbn'); 

router.post(
  "/tambahbuku",
  uploadFields, // Gunakan middleware upload
  tambahBuku
);

module.exports = router;