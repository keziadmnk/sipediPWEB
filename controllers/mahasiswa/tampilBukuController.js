const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");
const { Op } = require("sequelize");

const detailBuku = async (req, res) => {
  try {
    const { nomor_isbn } = req.params;

    const buku = await Buku.findByPk(nomor_isbn, {
       include: [
        { model: Kategori, as: 'kategori' },
        { model: Jenis, as: 'jenis' }
      ]
    });

    if (!buku) {
      return res.status(404).send("Buku tidak ditemukan");
    }

    res.render("mahasiswa/detailbuku", {buku});
  } catch (error) {
    console.error("Error fetching detail buku:", error);
    res.status(500).send("Internal Server Error");
  }
};


const cariBuku = async (req, res) => {
  try {
    const selectedKategori = req.query.kategori || null; // Filter kategori dari query parameter
    const searchQuery = req.query.search || '';  // Ambil query pencarian dari URL

    const whereClause = {};

    // Filter berdasarkan kategori jika ada
    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

    // Filter berdasarkan judul_buku jika ada query pencarian
    if (searchQuery) {
      whereClause.judul_buku = {
        [Op.like]: `%${searchQuery}%`
      };
    }

    const buku = await Buku.findAll({
      where: whereClause,
      include: [
        { model: Kategori, as: 'kategori' } // Include kategori untuk ditampilkan
      ]
    });

    const kategori = await Kategori.findAll(); // Ambil semua kategori untuk filter dropdown

    res.render("mahasiswa/koleksibuku", {
      kategori,
      buku,
      selectedKategori: selectedKategori ? parseInt(selectedKategori) : null, // Kirim kategori yang dipilih
      searchQuery  // Kirimkan query pencarian ke tampilan
    });

  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = { detailBuku, cariBuku}
