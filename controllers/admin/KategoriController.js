const { Buku } = require("../../models/BukuModel");
const { Kategori } = require("../../models/KategoriModel");
const { Op } = require("sequelize");

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
    const kategori = await Kategori.findAll();
    
    res.render('admin/kategoribuku', { kategori });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).send("Internal Server Error");
  }
};

const showTambahBuku = async (req, res) => {
  try {
    const kategori = await Kategori.findAll();
    
    res.render('admin/tambahbuku', { kategori });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).send("Internal Server Error");
  }
};


const showEditKategoriForm = async (req, res) => {
  try {
    const { id_kategori } = req.params;
    const kategori = await Kategori.findByPk(id_kategori);

    if (!kategori) {
      return res.status(404).send("Kategori tidak ditemukan.");
    }

    res.render('admin/editkategori', { kategori }); 
  } catch (error) {
    console.error("Error showing edit kategori form:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id_kategori } = req.params;
    const { nama_kategori } = req.body;

    const kategori = await Kategori.findByPk(id_kategori);

    if (!kategori) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan." });
    }

    await kategori.update({ nama_kategori }); 
    req.session.message = {
      type: 'success',
      text: 'Kategori berhasil diperbarui!'
    };
    res.redirect('/admin/kategori'); 
  } catch (error) {
    console.error("Error updating kategori:", error);
    req.session.message = {
      type: 'error',
      text: 'Gagal memperbarui kategori: ' + error.message
    };
    res.redirect('/admin/kategori');
  }
};

const deleteKategori = async (req, res) => {
  try {
    const { id_kategori } = req.params;

    const kategori = await Kategori.findByPk(id_kategori);

    if (!kategori) {
      req.session.message = {
        type: 'error',
        text: 'Kategori tidak ditemukan.'
      };
      return res.redirect('/admin/kategori');
    }


    const jumlahBukuTerkait = await Buku.count({
      where: { id_kategori: id_kategori }
    });

    if (jumlahBukuTerkait > 0) {
      req.session.message = {
        type: 'error',
        text: `Tidak dapat menghapus kategori karena masih ada ${jumlahBukuTerkait} buku yang menggunakannya.`
      };
      return res.redirect('/admin/kategori');
    }

    await kategori.destroy(); 
    req.session.message = {
      type: 'success',
      text: 'Kategori berhasil dihapus!'
    };
    res.redirect('/admin/kategori');
  } catch (error) {
    console.error("Error deleting kategori:", error);
    req.session.message = {
      type: 'error',
      text: 'Gagal menghapus kategori: ' + error.message
    };
    res.redirect('/admin/kategori');
  }
};

module.exports = { tambahKategori, findAllKategori, showTambahBuku, showEditKategoriForm, updateKategori, deleteKategori}
