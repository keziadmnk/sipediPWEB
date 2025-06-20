// controllers/admin/MahasiswaController.js
const bcrypt = require("bcrypt");
const { Pengguna, Role } = require('../../models/relation');

const findAllMahasiswa = async (req, res) => {
  try {
    const mahasiswaList = await Pengguna.findAll({
      include: [
        {
          model: Role,
          where: { nama_role: 'mahasiswa' }, // pastikan ini cocok dengan isi tabel Role
        },
      ],
    });

    res.render('admin/datamahasiswa', { dataMahasiswa: mahasiswaList });
  } catch (error) {
    console.error("Gagal mengambil data mahasiswa:", error);
    res.status(500).send("Terjadi kesalahan dalam mengambil data mahasiswa.");
  }
};
const showTambahMahasiswaForm = async (req, res) => {
  try {
    res.render('admin/tambahmahasiswa', { message: null }); // Render the form, initially no message
  } catch (error) {
    console.error("Error showing tambah mahasiswa form:", error);
    res.status(500).send("Terjadi kesalahan pada server saat memuat form.");
  }
};


const tambahMahasiswa = async (req, res) => {
  try {
    const { id_pengguna, nama_lengkap, email, nomor_hp, alamat, password, confirm_password } = req.body;

    // 1. Validasi input
    if (!id_pengguna || !nama_lengkap || !email || !password || !confirm_password) {
      req.session.message = {
        type: 'error',
        text: 'Semua field wajib (NIM, Nama Lengkap, Email, Password, Konfirmasi Password) harus diisi.'
      };
      return res.redirect('/admin/tambahmahasiswa');
    }

    if (password !== confirm_password) {
      req.session.message = {
        type: 'error',
        text: 'Password dan Konfirmasi Password tidak cocok.'
      };
      return res.redirect('/admin/tambahmahasiswa');
    }

    // 2. Cek apakah NIM atau email sudah terdaftar
    const existingMahasiswa = await Pengguna.findOne({
      where: {
        [require('sequelize').Op.or]: [ //
          { id_pengguna: id_pengguna },
          { email: email }
        ]
      }
    });

    if (existingMahasiswa) {
      let errorMessage = '';
      if (existingMahasiswa.id_pengguna === id_pengguna) {
        errorMessage = 'NIM sudah terdaftar.';
      } else if (existingMahasiswa.email === email) {
        errorMessage = 'Email sudah terdaftar.';
      }
      req.session.message = {
        type: 'error',
        text: errorMessage
      };
      return res.redirect('/admin/tambahmahasiswa');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //

    // 4. Dapatkan ID role 'mahasiswa'
    const roleMahasiswa = await Role.findOne({ where: { nama_role: 'mahasiswa' } }); //
    if (!roleMahasiswa) {
      req.session.message = {
        type: 'error',
        text: 'Role "mahasiswa" tidak ditemukan di database. Harap hubungi administrator.'
      };
      return res.redirect('/admin/tambahmahasiswa');
    }

    // 5. Buat pengguna baru
    await Pengguna.create({
      id_pengguna: id_pengguna,
      username: email, // Atau Anda bisa menggunakan id_pengguna sebagai username jika diinginkan
      password: hashedPassword,
      nama_lengkap: nama_lengkap,
      email: email,
      alamat: alamat || null, // Allow null if not provided
      nomor_hp: nomor_hp || null, // Allow null if not provided
      id_role: roleMahasiswa.id_role
    });

    req.session.message = {
      type: 'success',
      text: 'Data mahasiswa berhasil ditambahkan!'
    };
    res.redirect('/admin/datamahasiswa');

  } catch (error) {
    console.error("Error adding mahasiswa:", error);
    req.session.message = {
      type: 'error',
      text: 'Gagal menambahkan mahasiswa: ' + error.message
    };
    res.redirect('/admin/tambahmahasiswa');
  }
};

module.exports = {
  findAllMahasiswa,
  showTambahMahasiswaForm,
  tambahMahasiswa,
};
