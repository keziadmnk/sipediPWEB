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
    const searchQuery = req.query.search || '';  // Ambil query pencarian dari URL
    const buku = await Buku.findAll({
      where: {
        judul_buku: {
          [Op.like]: `%${searchQuery}%`  // Mencari buku dengan judul yang mengandung kata pencarian
        }
      }
    });

    const kategori = await require("../../models/KategoriModel").Kategori.findAll(); // Ambil semua kategori
    res.render("mahasiswa/koleksibuku", {
      kategori,
      buku,
      searchQuery  // Kirimkan query pencarian ke tampilan
    });

  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).send("Internal Server Error");
  }
};



module.exports = { detailBuku, cariBuku}
