const { Pengguna } = require('../../models/PenggunaModel');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const showProfilPetugas = async (req, res) => {
    try {
        const idLogin = req.user.userId;

        if (!idLogin) {
            return res.status(400).render('error', {
                message: 'ID pengguna tidak ditemukan dalam session.',
                error: {}
            });
        }

        const petugas = await Pengguna.findOne({
            where: { id_pengguna: idLogin }
        });

        if (!petugas) {
            return res.status(404).render('error', {
                message: 'Data petugas tidak ditemukan.',
                error: {}
            });
        }

        res.render('petugas/profil', { petugas });
    } catch (error) {
        console.error('Gagal menampilkan profil petugas:', error);
        res.status(500).render('error', {
            message: 'Gagal memuat profil petugas.',
            error
        });
    }
};

const showEditBiodataPetugas = async (req, res) => {
    try {
        const idLogin = req.user.userId;

        if (!idLogin) {
            return res.status(400).render('error', {
                message: 'ID pengguna tidak ditemukan dalam session.',
                error: {}
            });
        }

        const petugas = await Pengguna.findOne({
            where: { id_pengguna: idLogin }
        });

        if (!petugas) {
            return res.status(404).render('error', {
                message: 'Data petugas tidak ditemukan.',
                error: {}
            });
        }

        res.render('petugas/edit-biodata', { petugas });
    } catch (error) {
        console.error('Gagal menampilkan form edit biodata petugas:', error);
        res.status(500).render('error', {
            message: 'Gagal memuat form edit biodata.',
            error
        });
    }
};

const updateFotoPetugas = async (req, res) => {
    try {
        const idLogin = req.user.userId;
        
        if (!idLogin) {
            return res.status(400).send('ID pengguna tidak ditemukan dalam session');
        }

        const petugas = await Pengguna.findOne({ where: { id_pengguna: idLogin }});

        if (!petugas) {
            return res.status(404).send('Petugas tidak ditemukan');
        }

        // Hapus foto lama jika ada
        if (petugas.foto && req.file) {
            const oldPath = path.join(__dirname, '../../public', petugas.foto);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        if (req.file) {
            // Path relatif untuk disimpan di DB dan diakses dari browser
            const newPath = `/uploads/profil/${req.file.filename}`;
            petugas.foto = newPath;
            await petugas.save();
            console.log('Foto petugas berhasil diupdate:', newPath);
        } else {
            console.log('Tidak ada file yang diupload');
        }

        res.redirect('/petugas/profil');

    } catch (error) {
        console.error('Gagal update foto profil petugas:', error);
        res.status(500).send('Terjadi kesalahan saat update foto profil.');
    }
};

const updateBiodataPetugas = async (req, res) => {
    try {
        const idLogin = req.user.userId;
        const { nama_lengkap, email, nomor_hp, alamat, old_password, password, confirm_password } = req.body;

        if (!idLogin) {
            return res.status(400).json({
                success: false,
                message: 'ID pengguna tidak ditemukan dalam session'
            });
        }

        const petugas = await Pengguna.findOne({ where: { id_pengguna: idLogin }});

        if (!petugas) {
            return res.status(404).json({
                success: false,
                message: 'Petugas tidak ditemukan'
            });
        }

        // Validasi input wajib
        if (!nama_lengkap || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nama Lengkap dan Email adalah field wajib yang harus diisi.'
            });
        }

        // Cek apakah email sudah digunakan oleh pengguna lain
        const existingUser = await Pengguna.findOne({
            where: {
                email: email,
                id_pengguna: { [require('sequelize').Op.ne]: idLogin }
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah digunakan oleh pengguna lain.'
            });
        }

        // Validasi password jika ada input password
        if (old_password || password || confirm_password) {
            // Pastikan semua field password diisi
            if (!old_password || !password || !confirm_password) {
                return res.status(400).json({
                    success: false,
                    message: 'Untuk mengubah password, Anda harus mengisi Password Saat Ini, Password Baru, dan Konfirmasi Password Baru.'
                });
            }

            // Validasi password lama
            const isOldPasswordValid = await bcrypt.compare(old_password, petugas.password);
            if (!isOldPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Password saat ini salah. Jika Anda lupa password, silakan hubungi admin.'
                });
            }

            // Validasi password baru dan konfirmasi
            if (password !== confirm_password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password Baru dan Konfirmasi Password Baru tidak cocok.'
                });
            }

            // Validasi panjang password baru (minimal 6 karakter)
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password baru minimal harus 6 karakter.'
                });
            }
        }

        // Update data petugas
        const updateData = {
            nama_lengkap,
            email,
            nomor_hp: nomor_hp || null,
            alamat: alamat || null
        };

        // Hash password baru jika validasi berhasil
        if (old_password && password && confirm_password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await petugas.update(updateData);

        res.json({
            success: true,
            message: 'Biodata berhasil diupdate!'
        });

    } catch (error) {
        console.error('Gagal update biodata petugas:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat update biodata: ' + error.message
        });
    }
};

module.exports = {
    showProfilPetugas,
    showEditBiodataPetugas,
    updateFotoPetugas,
    updateBiodataPetugas
}; 