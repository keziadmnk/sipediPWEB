const { Buku } = require("../../models/BukuModel");
const { Jenis } = require("../../models/JenisModel");
const { Kategori } = require("../../models/KategoriModel");
const { Op } = require("sequelize");
const { BukuJenis } = require("../../models/BukuJenisModel");

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
    const { page = 1 } = req.query;
    const currentPage = parseInt(page);
    const limit = 10; // Jumlah buku per halaman
    const offset = (currentPage - 1) * limit;

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

    // Get total count for pagination
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
        { model: Kategori, as: 'kategori' } // Include kategori untuk ditampilkan
      ],
      limit: limit,
      offset: offset,
      order: [['judul_buku', 'ASC']], // Urutkan berdasarkan judul buku
    });

    const kategori = await Kategori.findAll(); // Ambil semua kategori untuk filter dropdown

    res.render("mahasiswa/koleksibuku", {
      kategori,
      buku,
      selectedKategori: selectedKategori ? parseInt(selectedKategori) : null, // Kirim kategori yang dipilih
      searchQuery,  // Kirimkan query pencarian ke tampilan
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
    const limit = 10; // Jumlah buku per halaman
    const offset = (currentPage - 1) * limit;

    // Build where clause for search
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { judul_buku: { [Op.like]: `%${searchQuery}%` } },
          { pengarang: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    // Add kategori filter if selected
    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

    // Get total count for pagination
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
      order: [['judul_buku', 'ASC']], // Urutkan berdasarkan judul buku
    });

    // Get all categories for sidebar
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
    const limit = 10; // Jumlah buku per halaman
    const offset = (currentPage - 1) * limit;

    // Build where clause for search
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { judul_buku: { [Op.like]: `%${searchQuery}%` } },
          { pengarang: { [Op.like]: `%${searchQuery}%` } },
        ],
      };
    }

    // Add kategori filter if selected
    if (selectedKategori) {
      whereClause.id_kategori = selectedKategori;
    }

    // Get total count for pagination
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

    // Get all e-books (books with jenis 'e-book')
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
          where: { nama_jenis: "e-book" }, // Only get books with jenis 'e-book'
          required: true, // INNER JOIN to ensure only e-books are returned
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
      order: [['judul_buku', 'ASC']], // Urutkan berdasarkan judul buku
    });

    // Get all categories for sidebar
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
