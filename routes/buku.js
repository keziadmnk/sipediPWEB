const express = require('express');
const { tambahBuku, showTambahBuku } = require('../controllers/admin/buku');
const upload = require('../config/multer');
const router = express.Router();

// Route untuk menampilkan form tambah buku
router.get('/tambahbuku', showTambahBuku);

// Route untuk memproses form tambah buku dengan upload file
router.post('/tambahbuku', 
    upload.fields([
        { name: 'upload_pdf', maxCount: 1 },
        { name: 'upload_sampul', maxCount: 1 }
    ]), 
    tambahBuku
);

module.exports = router;