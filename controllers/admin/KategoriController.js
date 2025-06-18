const { Buku } = require("../../models/BukuModel");
const { Kategori } = require("../../models/KategoriModel");

const tambahKategori = async (req, res) => {
  try {
    const { kategori } = req.body;

    await Kategori.create({
      nama_kategori: kategori,
    });
    res.redirect("/admin/kategori");

  } catch (error) {
    console.error("Error adding kategori:", error);
    res.status(500).send("Internal Server Error");
  }
};

const findAllKategori = async (req, res) => {
  try {
    // Mengambil semua data kategori dari database
    const kategori = await Kategori.findAll();
    
    res.render('admin/kategoribuku', { kategori });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).send("Internal Server Error");
  }
};

const showTambahBuku = async (req, res) => {
  try {
    // Mengambil semua data kategori dari database
    const kategori = await Kategori.findAll();
    
    // Render halaman tambah buku dengan data kategori
    res.render('admin/tambahbuku', { kategori });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).send("Internal Server Error");
  }
};

const showKatalogBuku = async (req, res) => {
  try {
    const selectedKategori = req.query.kategori || null;
    const kategori = await Kategori.findAll();

    let buku;
    if (selectedKategori) {
      buku = await Buku.findAll({
        where: { id_kategori: selectedKategori },
        include: [{ model: Kategori, as: 'kategori' }]
      });
    } else {
      buku = await Buku.findAll({
        include: [{ model: Kategori, as: 'kategori' }]
      });
    }

    res.render("mahasiswa/koleksibuku", {
      kategori,
      buku,
      selectedKategori: parseInt(selectedKategori)
    });

  } catch (error) {
    console.error("Error fetching katalog:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = { tambahKategori, findAllKategori, showTambahBuku, showKatalogBuku}
