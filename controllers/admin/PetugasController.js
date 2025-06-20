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

const tambahPetugas = async (req, res) => {
    const { nama_lengkap, username, email, alamat, nomor_hp, password, password2 } = req.body;

    if (password !== password2) {
        return res.status(400).send('Password tidak cocok.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cari id_role untuk petugas
        const role = await Role.findOne({ where: { nama_role: 'petugas' } });

        if (!role) return res.status(400).send("Role petugas tidak ditemukan");

        const newPetugas = await Pengguna.create({
            id_pengguna: uuidv4().slice(0, 10), // atau generate ID sesuai skema kamu
            username,
            password: hashedPassword,
            nama_lengkap,
            email,
            alamat,
            nomor_hp,
            id_role: role.id_role
        });

        res.redirect('/admin/datapetugas');
    } catch (error) {
        console.error("Gagal tambah petugas:", error);
        res.status(500).send("Terjadi kesalahan saat menambah petugas.");
    }
};

module.exports = {
    findAllPetugas, tambahPetugas,
};
