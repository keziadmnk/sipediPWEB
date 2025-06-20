// controllers/admin/MahasiswaController.js

const { Pengguna, Role } = require('../../models/relation');

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
    console.error("Gagal mengambil data mahasiswa:", error);
    res.status(500).send("Terjadi kesalahan dalam mengambil data mahasiswa.");
  }
};

module.exports = {
  findAllPetugas,
};
