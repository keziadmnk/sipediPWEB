const express = require("express");
var router = express.Router();
const {
  tambahKategori,
  findAllKategori,
  showTambahBuku,
} = require("../controllers/admin/KategoriController");
const { authenticate } = require("../middlewares/authenticate");
const {
  findAllBuku,
  tambahBuku,
} = require("../controllers/admin/BukuController");
// Import upload middleware
const { uploadFields } = require("../middlewares/upload");

router.get("/dashboard", authenticate, (req, res) => {
  res.render("admin/dashboard");
});

router.get("/tambahkategori", function (req, res, next) {
  res.render("admin/tambahkategori");
});

router.post("/tambahkategori", tambahKategori);

router.get("/kategori", findAllKategori);

router.get("/databuku", findAllBuku);

router.get("/tambahbuku", showTambahBuku);

router.post(
  "/tambahbuku",
  uploadFields, // Gunakan middleware upload
  tambahBuku
);

module.exports = router;