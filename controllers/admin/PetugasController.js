// controllers/admin/MahasiswaController.js

const { Pengguna, Role } = require('../../models/relation');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const findAllPetugas = async (req, res) => {
    try {
        const petugasList = await Pengguna.findAll({
            include: [
                {
                    model: Role,
                    where: { nama_role: 'petugas' }, // pastikan ini cocok dengan isi tabel Role
                },
            ],
        });

        res.render('admin/datapetugas', { dataPetugas: petugasList });
    } catch (error) {
        console.error("Gagal mengambil data petugas:", error);
        res.status(500).send("Terjadi kesalahan dalam mengambil data petugas.");
    }
};

const showTambahPetugasForm = async (req, res) => {
    try {
        res.render('admin/tambahpetugas', { message: null }); // Render the form, initially no message
    } catch (error) {
        console.error("Error showing tambah petugas form:", error);
        res.status(500).send("Terjadi kesalahan pada server saat memuat form.");
    }
};

const tambahPetugas = async (req, res) => {
    try {
        const { id_pengguna, nama_lengkap, email, nomor_hp, alamat, password, confirm_password } = req.body;

        // 1. Validasi input
        if (!id_pengguna || !nama_lengkap || !email || !password || !confirm_password) {
            req.session.message = {
                type: 'error',
                text: 'Semua field wajib (NIP, Nama Lengkap, Email, Password, Konfirmasi Password) harus diisi.'
            };
            return res.redirect('/admin/tambahpetugas');
        }

        if (password !== confirm_password) {
            req.session.message = {
                type: 'error',
                text: 'Password dan Konfirmasi Password tidak cocok.'
            };
            return res.redirect('/admin/tambahpetugas');
        }

        // 2. Cek apakah NIM atau email sudah terdaftar
        const existingPetugas = await Pengguna.findOne({
            where: {
                [require('sequelize').Op.or]: [ //
                    { id_pengguna: id_pengguna },
                    { email: email }
                ]
            }
        });

        if (existingPetugas) {
            let errorMessage = '';
            if (existingPetugas.id_pengguna === id_pengguna) {
                errorMessage = 'NIP sudah terdaftar.';
            } else if (existingPetugas.email === email) {
                errorMessage = 'Email sudah terdaftar.';
            }
            req.session.message = {
                type: 'error',
                text: errorMessage
            };
            return res.redirect('/admin/tambahpetugas');
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10); //

        // 4. Dapatkan ID role 'mahasiswa'
        const rolePetugas = await Role.findOne({ where: { nama_role: 'petugas' } }); //
        if (!rolePetugas) {
            req.session.message = {
                type: 'error',
                text: 'Role "petugas" tidak ditemukan di database. Harap hubungi administrator.'
            };
            return res.redirect('/admin/tambahpetugas');
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
            id_role: rolePetugas.id_role
        });

        req.session.message = {
            type: 'success',
            text: 'Data petugas berhasil ditambahkan!'
        };
        res.redirect('/admin/datapetugas');

    } catch (error) {
        console.error("Error adding petugas:", error);
        req.session.message = {
            type: 'error',
            text: 'Gagal menambahkan petugas: ' + error.message
        };
        res.redirect('/admin/tambahpetugas');
    }
};

module.exports = {
    findAllPetugas,
    showTambahPetugasForm,
    tambahPetugas,
};
