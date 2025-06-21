const { Pengguna } = require('../../models/PenggunaModel');
const fs = require('fs');
const path = require('path');

const findAkun = async (req, res) => {
    try {
        // Gunakan userId dari JWT token (sesuai dengan yang dibuat di loginController.js)
        const idLogin = req.user.userId;

        if (!idLogin) {
            return res.status(400).render('error', {
                message: 'ID pengguna tidak ditemukan dalam session.',
                error: {}
            });
        }

        const mahasiswa = await Pengguna.findOne({
            where: { id_pengguna: idLogin }
        });

        if (!mahasiswa) {
            return res.status(404).render('error', {
                message: 'Data mahasiswa tidak ditemukan.',
                error: {}
            });
        }

        res.render('mahasiswa/akun', { mahasiswa });
    } catch (error) {
        console.error('Gagal menampilkan profil mahasiswa:', error);
        res.status(500).render('error', {
            message: 'Gagal memuat profil mahasiswa.',
            error
        });
    }
};

const updateFoto = async (req, res) => {
    try {
        // Gunakan userId dari JWT token (sesuai dengan yang dibuat di loginController.js)
        const idLogin = req.user.userId;
        
        if (!idLogin) {
            return res.status(400).send('ID pengguna tidak ditemukan dalam session');
        }

        const mahasiswa = await Pengguna.findOne({ where: { id_pengguna: idLogin }});

        if (!mahasiswa) {
            return res.status(404).send('Mahasiswa tidak ditemukan');
        }

        // Hapus foto lama jika ada
        if (mahasiswa.foto && req.file) {
            const oldPath = path.join(__dirname, '../../public', mahasiswa.foto);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        if (req.file) {
            // Path relatif untuk disimpan di DB dan diakses dari browser
            const newPath = `/uploads/profil/${req.file.filename}`;
            mahasiswa.foto = newPath;
            await mahasiswa.save();
            console.log('Foto berhasil diupdate:', newPath);
        } else {
            console.log('Tidak ada file yang diupload');
        }

        res.redirect('/mahasiswa/akun');

    } catch (error) {
        console.error('Gagal update foto profil:', error);
        res.status(500).send('Terjadi kesalahan saat update foto profil.');
    }
};

module.exports = { findAkun, updateFoto };
