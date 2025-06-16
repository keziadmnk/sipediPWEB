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

module.exports = { tambahKategori }
