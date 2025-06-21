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

// Tampilkan form edit petugas
const showEditPetugas = async (req, res) => {
    try {
        const { id_pengguna } = req.params;
        
        // Ambil data petugas berdasarkan ID
        const petugas = await Pengguna.findByPk(id_pengguna, {
            include: [
                {
                    model: Role,
                    where: { nama_role: 'petugas' }
                }
            ]
        });

        if (!petugas) {
            req.session.message = {
                type: 'error',
                text: 'Petugas tidak ditemukan'
            };
            return res.redirect('/admin/datapetugas');
        }

        // Ambil pesan dari session jika ada
        const message = req.session.message;
        delete req.session.message;

        res.render('admin/editpetugas', { petugas, message });
    } catch (error) {
        console.error("Error showEditPetugas:", error);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat memuat data petugas'
        };
        res.redirect('/admin/datapetugas');
    }
};

// Proses update petugas
const updatePetugas = async (req, res) => {
    try {
        const { id_pengguna } = req.params;
        const { nama_lengkap, email, nomor_hp, alamat, password, confirm_password } = req.body;

        // 1. Validasi input wajib
        if (!nama_lengkap || !email) {
            req.session.message = {
                type: 'error',
                text: 'Nama Lengkap dan Email adalah field wajib yang harus diisi.'
            };
            return res.redirect(`/admin/editpetugas/${id_pengguna}`);
        }

        // 2. Cari petugas yang akan diupdate
        const petugas = await Pengguna.findByPk(id_pengguna);
        if (!petugas) {
            req.session.message = {
                type: 'error',
                text: 'Petugas tidak ditemukan'
            };
            return res.redirect('/admin/datapetugas');
        }

        // 3. Cek apakah email sudah digunakan oleh petugas lain
        const existingPetugas = await Pengguna.findOne({
            where: {
                email: email,
                id_pengguna: { [require('sequelize').Op.ne]: id_pengguna } // Exclude current petugas
            }
        });

        if (existingPetugas) {
            req.session.message = {
                type: 'error',
                text: 'Email sudah digunakan oleh petugas lain.'
            };
            return res.redirect(`/admin/editpetugas/${id_pengguna}`);
        }

        // 4. Validasi password jika diisi
        if (password || confirm_password) {
            if (!password || !confirm_password) {
                req.session.message = {
                    type: 'error',
                    text: 'Password dan Konfirmasi Password harus diisi keduanya jika ingin mengubah password.'
                };
                return res.redirect(`/admin/editpetugas/${id_pengguna}`);
            }

            if (password !== confirm_password) {
                req.session.message = {
                    type: 'error',
                    text: 'Password dan Konfirmasi Password tidak cocok.'
                };
                return res.redirect(`/admin/editpetugas/${id_pengguna}`);
            }
        }

        // 5. Update data petugas
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

        await petugas.update(updateData);

        req.session.message = {
            type: 'success',
            text: 'Data petugas berhasil diupdate!'
        };
        res.redirect('/admin/datapetugas');

    } catch (error) {
        console.error("Error updatePetugas:", error);
        req.session.message = {
            type: 'error',
            text: 'Gagal update petugas: ' + error.message
        };
        res.redirect(`/admin/editpetugas/${req.params.id_pengguna}`);
    }
};

const hapusPetugas = async (req, res) => {
    try {
        const { id_pengguna } = req.params;

        await Pengguna.destroy({
            where: { id_pengguna }
        });

        req.session.message = {
            type: 'success',
            text: 'Petugas berhasil dihapus.'
        };

        res.redirect('/admin/datapetugas');
    } catch (error) {
        console.error("Gagal menghapus petugas:", error);
        req.session.message = {
            type: 'error',
            text: 'Terjadi kesalahan saat menghapus petugas.'
        };
        res.redirect('/admin/datapetugas');
    }
};

module.exports = {
    findAllPetugas,
    showTambahPetugasForm,
    tambahPetugas,
    showEditPetugas,
    updatePetugas,
    hapusPetugas
};
