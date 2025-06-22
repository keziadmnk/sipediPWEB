const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");
const { Op } = require("sequelize");
const { BukuJenis } = require("../../models/BukuJenisModel");
const { Ulasan } = require("../../models/UlasanModel"); 
const { Sequelize } = require("sequelize"); 


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

    const ulasanStats = await Ulasan.findOne({
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
            [Sequelize.fn('COUNT', Sequelize.col('id_ulasan')), 'totalReviews']
        ],
        where: { nomor_isbn: nomor_isbn },
        raw: true 
    });

    const averageRating = ulasanStats.averageRating ? parseFloat(ulasanStats.averageRating) : 0;
    const totalReviews = ulasanStats.totalReviews || 0;

    res.render("mahasiswa/detailbuku", {
        buku,
        rating: { 
            rataRata: averageRating,
            totalUlasan: totalReviews
        }
    });
  } catch (error) {
    console.error("Error fetching detail buku:", error);
    res.status(500).send("Internal Server Error");
  }
};


const cariBuku = async (req, res) => {
  try {
    const selectedKategori = req.query.kategori || null; 
    const searchQuery = req.query.search || '';  
    const { page = 1 } = req.query;
    const currentPage = parseInt(page);
    const limit = 10; 
    const offset = (currentPage - 1) * limit;

    const whereClause = {};

    
    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

   
    if (searchQuery) {
      whereClause.judul_buku = {
        [Op.like]: `%${searchQuery}%`
      };
    }

    
    const totalBooks = await Buku.count({
      where: whereClause,
      include: [
        { model: Kategori, as: 'kategori' }
      ]
    });

    const totalPages = Math.ceil(totalBooks / limit);

    const buku = await Buku.findAll({
      where: whereClause,
      include: [
        { model: Kategori, as: 'kategori' }
      ],
      limit: limit,
      offset: offset,
      order: [['judul_buku', 'ASC']], 
    });

    const kategori = await Kategori.findAll(); 

    res.render("mahasiswa/koleksibuku", {
      kategori,
      buku,
      selectedKategori: selectedKategori ? parseInt(selectedKategori) : null, 
      searchQuery,  
      pagination: {
        currentPage,
        totalPages,
        totalBooks,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage + 1,
        prevPage: currentPage - 1,
      },
    });

  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).send("Internal Server Error");
  }
};

const findAllBuku = async (req, res) => {
  try {
    const { search, kategori, page = 1 } = req.query;
    const selectedKategori = kategori || null;
    const searchQuery = search || "";
    const currentPage = parseInt(page);
    const limit = 10; 
    const offset = (currentPage - 1) * limit;

    
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { judul_buku: { [Op.like]: `%${searchQuery}%` } },
          { pengarang: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

    const totalBooks = await Buku.count({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: "kategori",
          attributes: ["nama_kategori"],
        },
      ],
    });

    const totalPages = Math.ceil(totalBooks / limit);

    const buku = await Buku.findAll({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: "kategori",
          attributes: ["nama_kategori"],
        },
        {
          model: Jenis,
          as: "jenis",
          attributes: ["nama_jenis"],
        },
      ],
      attributes: [
        "nomor_isbn",
        "judul_buku",
        "pengarang",
        "upload_sampul",
        "jumlah_stok",
      ],
      limit: limit,
      offset: offset,
      order: [['judul_buku', 'ASC']],
    });

    const kategoriList = await Kategori.findAll({
      attributes: ["id_kategori", "nama_kategori"],
    });

    res.render("mahasiswa/koleksibuku", {
      buku,
      kategori: kategoriList,
      selectedKategori,
      searchQuery,
      pagination: {
        currentPage,
        totalPages,
        totalBooks,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage + 1,
        prevPage: currentPage - 1,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Internal Server Error");
  }
};

const findAllEbook = async (req, res) => {
  try {
    const { search, kategori, page = 1 } = req.query;
    const selectedKategori = kategori || null;
    const searchQuery = search || "";
    const currentPage = parseInt(page);
    const limit = 10; 
    const offset = (currentPage - 1) * limit;

    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { judul_buku: { [Op.like]: `%${searchQuery}%` } },
          { pengarang: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

    const totalBooks = await Buku.count({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: "kategori",
          attributes: ["nama_kategori"],
        },
        {
          model: Jenis,
          as: "jenis",
          attributes: ["nama_jenis"],
          where: { nama_jenis: "e-book" },
          required: true,
        },
      ],
    });

    const totalPages = Math.ceil(totalBooks / limit);

    const ebook = await Buku.findAll({
      where: whereClause,
      include: [
        {
          model: Kategori,
          as: "kategori",
          attributes: ["nama_kategori"],
        },
        {
          model: Jenis,
          as: "jenis",
          attributes: ["nama_jenis"],
          where: { nama_jenis: "e-book" }, 
          required: true, 
        },
      ],
      attributes: [
        "nomor_isbn",
        "judul_buku",
        "pengarang",
        "upload_sampul",
        "jumlah_stok",
      ],
      limit: limit,
      offset: offset,
      order: [['judul_buku', 'ASC']],
    });

    const kategoriList = await Kategori.findAll({
      attributes: ["id_kategori", "nama_kategori"],
    });

    res.render("mahasiswa/ebook", {
      ebook,
      kategori: kategoriList,
      selectedKategori,
      searchQuery,
      pagination: {
        currentPage,
        totalPages,
        totalBooks,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage + 1,
        prevPage: currentPage - 1,
      },
    });
  } catch (error) {
    console.error("Error fetching e-books:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { detailBuku, cariBuku, findAllBuku, findAllEbook }