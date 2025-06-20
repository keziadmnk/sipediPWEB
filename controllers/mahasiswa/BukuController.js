const { Buku, Ulasan, Pengguna } = require("../../models/relation"); // Import models
const { Op, Sequelize } = require("sequelize"); // Import Sequelize and Op for aggregation

// Helper function to format date
const formatTanggal = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// GET /buku/:id/ulasan
exports.getDaftarUlasan = async (req, res) => {
    try {
        const { id } = req.params; // This should be nomor_isbn

        const buku = await Buku.findByPk(id, {
            attributes: ['nomor_isbn', 'judul_buku', 'pengarang', 'deskripsi']
        });

        if (!buku) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        const ulasans = await Ulasan.findAll({
            where: { nomor_isbn: id },
            include: [
                {
                    model: Pengguna,
                    attributes: ['nama_lengkap'], // Ambil nama pengguna
                    required: true,
                }
            ],
            order: [['createdAt', 'DESC']] // Urutkan ulasan terbaru dulu
        });

        // Calculate average rating and distribution
        const totalUlasanCount = ulasans.length;
        let sumRatings = 0;
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        ulasans.forEach(ulasan => {
            sumRatings += ulasan.rating;
            if (ratingDistribution[ulasan.rating] !== undefined) {
                ratingDistribution[ulasan.rating]++;
            }
        });

        const rataRata = totalUlasanCount > 0 ? (sumRatings / totalUlasanCount).toFixed(1) : 0;

        const formattedUlasans = ulasans.map(ulasan => ({
            user: { nama: ulasan.Pengguna ? ulasan.Pengguna.nama_lengkap : 'Anonim' }, // Access nested data
            rating: ulasan.rating,
            createdAt: formatTanggal(ulasan.createdAt), // Assuming createdAt exists or is managed by Sequelize
            komentar: ulasan.isi_ulasan,
        }));

        res.render('mahasiswa/ulasan', {
            buku: buku,
            ulasans: formattedUlasans,
            rating: {
                rataRata: parseFloat(rataRata),
                totalUlasan: totalUlasanCount,
                distribusi: ratingDistribution
            }
        });

    } catch (error) {
        console.error("Error fetching daftar ulasan:", error);
        res.status(500).send("Server Error");
    }
};

// GET /buku/:id/ulasan/tulis
exports.getFormUlasan = async (req, res) => {
    try {
        const { id } = req.params; // This should be nomor_isbn

        const buku = await Buku.findByPk(id, {
            attributes: ['nomor_isbn', 'judul_buku']
        });

        if (!buku) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        // You might need to pass user information here if the form requires it
        res.render('mahasiswa/tulisUlasan', {
            buku: buku,
            user: req.user // Pass user info from authenticated session
        });
    } catch (error) {
        console.error("Error fetching form ulasan:", error);
        res.status(500).send("Server Error");
    }
};

// POST /buku/:id/ulasan
exports.createUlasan = async (req, res) => {
    try {
        const bookId = req.params.id; // nomor_isbn
        const { isi_ulasan, rating } = req.body;
        const userId = req.user.userId; // Assuming req.user contains userId from authentication middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!isi_ulasan || !rating) {
            return res.status(400).json({ success: false, message: "Isi ulasan dan rating harus diisi." });
        }

        // Check if the book exists
        const buku = await Buku.findByPk(bookId);
        if (!buku) {
            return res.status(404).json({ success: false, message: "Buku tidak ditemukan." });
        }

        // Create the review
        await Ulasan.create({
            nomor_isbn: bookId,
            id_pengguna: userId,
            isi_ulasan: isi_ulasan,
            rating: parseInt(rating)
        });

        res.redirect(`/buku/${bookId}/ulasan`);
    } catch (error) {
        console.error("Error creating ulasan:", error);
        res.status(500).send("Server Error: " + error.message);
    }
};

// You can add a detail book function here if it's not handled elsewhere
exports.getDetailBuku = async (req, res) => {
    try {
        const { id } = req.params; // This should be nomor_isbn

        const buku = await Buku.findByPk(id, {
           include: [
            { model: Kategori, as: 'kategori' }, // Assuming Kategori model is imported
            { model: Jenis, as: 'jenis' } // Assuming Jenis model is imported
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