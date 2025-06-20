// controllers/admin/MahasiswaController.js

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

module.exports = {
  findAllMahasiswa,
};
