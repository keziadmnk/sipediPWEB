const { Op } = require("sequelize");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require('../../models/PenggunaModel');
const { Buku } = require('../../models/BukuModel');
const { Kategori } = require('../../models/KategoriModel');
const { Role } = require('../../models/RoleModel');


const showDashboardAdmin = async (req, res) => {
  try {
    // Hitung jumlah petugas (role = 2)
    const jumlahPetugas = await Pengguna.count({
      where: { id_role: 2 }
    });

    // Hitung jumlah mahasiswa (role = 3)
    const jumlahMahasiswa = await Pengguna.count({
      where: { id_role: 3 }
    });

    // Hitung jumlah buku
    const jumlahBuku = await Buku.count();

    // Hitung jumlah kategori
    const jumlahKategori = await Kategori.count();

    // Render dashboard dengan data
    res.render('admin/dashboard', {
      jumlahPetugas,
      jumlahMahasiswa,
      jumlahBuku,
      jumlahKategori
    });

  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).send('Terjadi kesalahan saat memuat dashboard');
  }
};

module.exports = {  showDashboardAdmin }