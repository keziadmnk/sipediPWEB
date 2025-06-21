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

// Tampilkan form edit mahasiswa
const showEditMahasiswa = async (req, res) => {
  try {
    const { id_pengguna } = req.params;
    
    // Ambil data mahasiswa berdasarkan ID
    const mahasiswa = await Pengguna.findByPk(id_pengguna, {
      include: [
        {
          model: Role,
          where: { nama_role: 'mahasiswa' }
        }
      ]
    });

    if (!mahasiswa) {
      req.session.message = {
        type: 'error',
        text: 'Mahasiswa tidak ditemukan'
      };
      return res.redirect('/admin/datamahasiswa');
    }

    // Ambil pesan dari session jika ada
    const message = req.session.message;
    delete req.session.message;

    res.render('admin/editmahasiswa', { mahasiswa, message });
  } catch (error) {
    console.error("Error showEditMahasiswa:", error);
    req.session.message = {
      type: 'error',
      text: 'Terjadi kesalahan saat memuat data mahasiswa'
    };
    res.redirect('/admin/datamahasiswa');
  }
};

// Proses update mahasiswa
const updateMahasiswa = async (req, res) => {
  try {
    const { id_pengguna } = req.params;
    const { nama_lengkap, email, nomor_hp, alamat, password, confirm_password } = req.body;

    // 1. Validasi input wajib
    if (!nama_lengkap || !email) {
      req.session.message = {
        type: 'error',
        text: 'Nama Lengkap dan Email adalah field wajib yang harus diisi.'
      };
      return res.redirect(`/admin/editmahasiswa/${id_pengguna}`);
    }

    // 2. Cari mahasiswa yang akan diupdate
    const mahasiswa = await Pengguna.findByPk(id_pengguna);
    if (!mahasiswa) {
      req.session.message = {
        type: 'error',
        text: 'Mahasiswa tidak ditemukan'
      };
      return res.redirect('/admin/datamahasiswa');
    }

    // 3. Cek apakah email sudah digunakan oleh mahasiswa lain
    const existingMahasiswa = await Pengguna.findOne({
      where: {
        email: email,
        id_pengguna: { [require('sequelize').Op.ne]: id_pengguna } // Exclude current mahasiswa
      }
    });

    if (existingMahasiswa) {
      req.session.message = {
        type: 'error',
        text: 'Email sudah digunakan oleh mahasiswa lain.'
      };
      return res.redirect(`/admin/editmahasiswa/${id_pengguna}`);
    }

    // 4. Validasi password jika diisi
    if (password || confirm_password) {
      if (!password || !confirm_password) {
        req.session.message = {
          type: 'error',
          text: 'Password dan Konfirmasi Password harus diisi keduanya jika ingin mengubah password.'
        };
        return res.redirect(`/admin/editmahasiswa/${id_pengguna}`);
      }

      if (password !== confirm_password) {
        req.session.message = {
          type: 'error',
          text: 'Password dan Konfirmasi Password tidak cocok.'
        };
        return res.redirect(`/admin/editmahasiswa/${id_pengguna}`);
      }
    }

    // 5. Update data mahasiswa
    const updateData = {
      nama_lengkap,
      email,
      nomor_hp: nomor_hp || null,
      alamat: alamat || null
    };

    // Hash password baru jika diisi
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await mahasiswa.update(updateData);

    req.session.message = {
      type: 'success',
      text: 'Data mahasiswa berhasil diupdate!'
    };
    res.redirect('/admin/datamahasiswa');

  } catch (error) {
    console.error("Error updateMahasiswa:", error);
    req.session.message = {
      type: 'error',
      text: 'Gagal update mahasiswa: ' + error.message
    };
    res.redirect(`/admin/editmahasiswa/${req.params.id_pengguna}`);
  }
};

const hapusMahasiswa = async (req, res) => {
  try {
    const { id_pengguna } = req.params;

    await Pengguna.destroy({
      where: { id_pengguna }
    });

    req.session.message = {
      type: 'success',
      text: 'Mahasiswa berhasil dihapus.'
    };

    res.redirect('/admin/datamahasiswa');
  } catch (error) {
    console.error("Gagal menghapus mahasiswa:", error);
    req.session.message = {
      type: 'error',
      text: 'Terjadi kesalahan saat menghapus mahasiswa.'
    };
    res.redirect('/admin/datamahasiswa');
  }
};

module.exports = {
  findAllMahasiswa,
  showTambahMahasiswaForm,
  tambahMahasiswa,
  showEditMahasiswa,
  updateMahasiswa,
  hapusMahasiswa,
};
