const { Buku, Ulasan, Pengguna, Kategori, Jenis } = require("../../models/relation"); // Import models
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
        const { id } = req.params; // This is nomor_isbn
        const userId = req.user.userId; // ID pengguna dari token

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
                    attributes: ['nama_lengkap'],
                    required: true,
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Cek apakah user sudah mengulas buku ini
        const userUlasan = await Ulasan.findOne({
            where: {
                nomor_isbn: id,
                id_pengguna: userId
            }
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
            user: { nama: ulasan.Pengguna ? ulasan.Pengguna.nama_lengkap : 'Anonim' },
            rating: ulasan.rating,
            createdAt: formatTanggal(ulasan.createdAt),
            komentar: ulasan.isi_ulasan,
            id_ulasan: ulasan.id_ulasan // Sertakan ID ulasan
        }));

        res.render('mahasiswa/ulasan', {
            buku: buku,
            ulasans: formattedUlasans,
            rating: {
                rataRata: parseFloat(rataRata),
                totalUlasan: totalUlasanCount,
                distribusi: ratingDistribution
            },
            userUlasanExists: !!userUlasan, // Menandakan apakah user sudah mengulas
            userUlasanId: userUlasan ? userUlasan.id_ulasan : null // ID ulasan jika sudah ada
        });

    } catch (error) {
        console.error("Error fetching daftar ulasan:", error);
        res.status(500).send("Server Error: " + error.message);
    }
};

// GET /buku/:id/ulasan/tulis
// Digunakan untuk menampilkan form Tulis Ulasan (jika belum ada)
exports.getFormUlasan = async (req, res) => {
    try {
        const { id } = req.params; // nomor_isbn
        const userId = req.user.userId;

        const buku = await Buku.findByPk(id, {
            attributes: ['nomor_isbn', 'judul_buku']
        });

        if (!buku) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        const existingUlasan = await Ulasan.findOne({
            where: {
                nomor_isbn: id,
                id_pengguna: userId
            }
        });

        if (existingUlasan) {
            // Jika ulasan sudah ada, redirect ke halaman edit ulasan
            return res.redirect(`/buku/${id}/ulasan/${existingUlasan.id_ulasan}/edit`);
        }

        res.render('mahasiswa/tulisUlasan', {
            buku: buku,
            user: req.user,
            ulasan: null, // Tidak ada ulasan yang sudah ada
            isEdit: false // Menandakan ini adalah form tulis ulasan baru
        });
    } catch (error) {
        console.error("Error fetching form ulasan:", error);
        res.status(500).send("Server Error: " + error.message);
    }
};

// POST /buku/:id/ulasan
// Untuk membuat ulasan baru
exports.createUlasan = async (req, res) => {
    try {
        const bookId = req.params.id; // nomor_isbn
        const { isi_ulasan, rating } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!isi_ulasan || !rating) {
            return res.status(400).json({ success: false, message: "Isi ulasan dan rating harus diisi." });
        }

        const buku = await Buku.findByPk(bookId);
        if (!buku) {
            return res.status(404).json({ success: false, message: "Buku tidak ditemukan." });
        }

        // Cek apakah pengguna sudah mengulas buku ini sebelumnya
        const existingUlasan = await Ulasan.findOne({
            where: {
                nomor_isbn: bookId,
                id_pengguna: userId
            }
        });

        if (existingUlasan) {
            // Jika ulasan sudah ada, arahkan ke update
            // Atau berikan pesan error bahwa sudah ada ulasan
            console.warn(`User ${userId} mencoba membuat ulasan kedua untuk buku ${bookId}. Mengarahkan ke update.`);
            await Ulasan.update(
                { isi_ulasan: isi_ulasan, rating: parseInt(rating) },
                { where: { id_ulasan: existingUlasan.id_ulasan } }
            );
            return res.redirect(`/buku/${bookId}/ulasan`); // Redirect kembali setelah update
        }

        // Jika ulasan belum ada, buat yang baru
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

// GET /buku/:nomor_isbn/ulasan/:id_ulasan/edit
exports.getEditUlasanForm = async (req, res) => {
    try {
        const { nomor_isbn, id_ulasan } = req.params;
        const userId = req.user.userId;

        const buku = await Buku.findByPk(nomor_isbn, {
            attributes: ['nomor_isbn', 'judul_buku']
        });

        if (!buku) {
            return res.status(404).send("Buku tidak ditemukan");
        }

        const ulasan = await Ulasan.findOne({
            where: {
                id_ulasan: id_ulasan,
                nomor_isbn: nomor_isbn,
                id_pengguna: userId // Pastikan hanya pemilik ulasan yang bisa mengedit
            }
        });

        if (!ulasan) {
            return res.status(404).send("Ulasan tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya.");
        }

        res.render('mahasiswa/editUlasan', { // Menggunakan template editUlasan.ejs
            buku: buku,
            user: req.user,
            ulasan: ulasan, // Kirim data ulasan yang ada
            isEdit: true // Menandakan ini adalah form edit
        });

    } catch (error) {
        console.error("Error fetching edit ulasan form:", error);
        res.status(500).send("Server Error: " + error.message);
    }
};

// POST /buku/:nomor_isbn/ulasan/:id_ulasan/edit (atau PUT jika bisa)
exports.updateUlasan = async (req, res) => {
    try {
        const { nomor_isbn, id_ulasan } = req.params;
        const { isi_ulasan, rating } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!isi_ulasan || !rating) {
            return res.status(400).json({ success: false, message: "Isi ulasan dan rating harus diisi." });
        }

        const ulasan = await Ulasan.findOne({
            where: {
                id_ulasan: id_ulasan,
                nomor_isbn: nomor_isbn,
                id_pengguna: userId // Pastikan hanya pemilik ulasan yang bisa mengedit
            }
        });

        if (!ulasan) {
            return res.status(404).json({ success: false, message: "Ulasan tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya." });
        }

        await ulasan.update({
            isi_ulasan: isi_ulasan,
            rating: parseInt(rating)
        });

        res.redirect(`/buku/${nomor_isbn}/ulasan`); // Redirect kembali ke halaman daftar ulasan

    } catch (error) {
        console.error("Error updating ulasan:", error);
        res.status(500).send("Server Error: " + error.message);
    }
};


// Anda bisa menambahkan fungsi detail buku di sini juga
exports.getDetailBuku = async (req, res) => {
    try {
        const { id } = req.params; // This should be nomor_isbn

        const buku = await Buku.findByPk(id, {
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

// Fungsi BARU untuk menghapus ulasan
exports.deleteUlasan = async (req, res) => {
    try {
        const { nomor_isbn, id_ulasan } = req.params;
        const userId = req.user.userId;

        const ulasan = await Ulasan.findOne({
            where: {
                id_ulasan: id_ulasan,
                nomor_isbn: nomor_isbn,
                id_pengguna: userId // Pastikan hanya pemilik ulasan yang bisa menghapus
            }
        });

        if (!ulasan) {
            return res.status(404).json({ success: false, message: "Ulasan tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya." });
        }

        await ulasan.destroy(); // Hapus ulasan dari database

        // Mengatur pesan sukses untuk ditampilkan di halaman ulasan
        req.session.message = {
            type: 'success',
            text: 'Ulasan berhasil dihapus.'
        };

        res.redirect(`/buku/${nomor_isbn}/ulasan`); // Redirect kembali ke halaman daftar ulasan

    } catch (error) {
        console.error("Error deleting ulasan:", error);
        req.session.message = {
            type: 'error',
            text: 'Gagal menghapus ulasan: ' + error.message
        };
        res.redirect(`/buku/${nomor_isbn}/ulasan`);
    }
};