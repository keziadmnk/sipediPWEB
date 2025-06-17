const bcrypt = require("bcrypt");
const { Pengguna, Role } = require("../models/relation");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== DEBUG LOGIN ===');
    console.log('Email dari form:', email);
    console.log('Password dari form:', password);

    // Cari user berdasarkan email dengan include role
    const user = await Pengguna.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['nama_role']
        }
      ]
    });

    console.log('User ditemukan:', user ? 'Ya' : 'Tidak');
    if (user) {
      console.log('ID Pengguna:', user.id_pengguna);
      console.log('Email user:', user.email);
      console.log('Password di database:', user.password);
      console.log('Role:', user.Role ? user.Role.nama_role : 'Role tidak ditemukan');
      console.log('Panjang password di DB:', user.password.length);
      console.log('Apakah password seperti hash bcrypt?', user.password.startsWith('$2b$'));
    }

    if (!user) {
      return res.status(404).render('login/formlogin', { 
        error: "Email tidak ditemukan" 
      });
    }

    // Cek apakah password di database sudah di-hash atau masih plain text
    let isMatch = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // Password sudah di-hash dengan bcrypt
      console.log('Password di database sudah di-hash, menggunakan bcrypt.compare');
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Password masih plain text - perbandingan langsung
      console.log('Password di database masih plain text, membandingkan langsung');
      isMatch = (password === user.password);
      
      // OPSIONAL: Hash password dan update di database untuk keamanan
      if (isMatch) {
        console.log('Login berhasil, akan meng-hash password untuk keamanan...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        console.log('Password berhasil di-hash dan diupdate di database');
      }
    }

    console.log('Password cocok?', isMatch);

    if (!isMatch) {
      return res.status(400).render('login/formlogin', { 
        error: "Password salah" 
      });
    }

    // Buat token JWT dengan informasi role
    const token = jwt.sign(
      { 
        userId: user.id_pengguna,
        role: user.Role.nama_role,
        email: user.email,
        nama: user.nama_lengkap
      }, 
      "secretkey", 
      { expiresIn: '1h' }
    );

    console.log('Token JWT dibuat');
    console.log('Role untuk redirect:', user.Role.nama_role);

    // Set cookie dan redirect berdasarkan role
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 jam
    });

    // Redirect berdasarkan role
    const roleName = user.Role.nama_role.toLowerCase();
    console.log('Redirect ke role:', roleName);
    
    switch (roleName) {
      case 'admin':
        console.log('Redirect ke /admin/dashboard');
        return res.redirect('/admin/dashboard');
      case 'petugas':
        console.log('Redirect ke /petugas/dashboard');
        return res.redirect('/petugas/dashboard');
      case 'mahasiswa':
        console.log('Redirect ke /mahasiswa/dashboard');
        return res.redirect('/mahasiswa/dashboard');
      default:
        console.log('Redirect ke /dashboard (default)');
        return res.redirect('/dashboard');
    }

  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).render('login/formlogin', { 
      error: "Terjadi kesalahan pada server: " + error.message 
    });
  }
};

// Fungsi untuk hash password yang sudah ada di database
const hashExistingPasswords = async () => {
  try {
    const users = await Pengguna.findAll();
    
    for (const user of users) {
      // Jika password belum di-hash
      if (!user.password.startsWith('$2b$') && !user.password.startsWith('$2a$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await user.update({ password: hashedPassword });
        console.log(`Password untuk user ${user.email} berhasil di-hash`);
      }
    }
    
    console.log('Semua password berhasil di-hash');
  } catch (error) {
    console.error('Error hash passwords:', error);
  }
};

// Fungsi logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

module.exports = { login, logout, hashExistingPasswords };