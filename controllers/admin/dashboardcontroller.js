const { Op } = require("sequelize");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require('../../models/PenggunaModel');
const { Buku } = require('../../models/BukuModel');
const { Kategori } = require('../../models/KategoriModel');
const { Role } = require('../../models/RoleModel');


const showDashboardAdmin = async (req, res) => {
  try {

    const jumlahPetugas = await Pengguna.count({
      where: { id_role: 2 }
    });

    
    const jumlahMahasiswa = await Pengguna.count({
      where: { id_role: 3 }
    });

    
    const jumlahBuku = await Buku.count();

    
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

const showProfilAdmin = async (req, res) => {
  try {
   
    const idLogin = req.user.userId;

    if (!idLogin) {
      return res.status(400).render('error', {
        message: 'ID pengguna tidak ditemukan dalam session.',
        error: {}
      });
    }

    const admin = await Pengguna.findOne({
      where: { id_pengguna: idLogin }
    });

    if (!admin) {
      return res.status(404).render('error', {
        message: 'Data admin tidak ditemukan.',
        error: {}
      });
    }

    res.render('admin/profil', { admin });
  } catch (error) {
    console.error('Gagal menampilkan profil admin:', error);
    res.status(500).render('error', {
      message: 'Gagal memuat profil admin.',
      error
    });
  }
};

module.exports = { showDashboardAdmin, showProfilAdmin }