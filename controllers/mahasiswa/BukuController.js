// GET /buku/:id/ulasan
exports.getDaftarUlasan = async (req, res) => {
    try {
        const dummyBuku = { id: req.params.id, judul: 'Dasar dasar Penguasaan Pemrograman Web', pengarang: 'Agusriandi', deskripsi: 'Buku ini dirancang untuk membantu pembaca...' };
        const dummyUlasans = [
            { user: { nama: 'Kezia Valerina', jumlahUlasan: 5 }, rating: 5, createdAt: '2 bulan lalu', komentar: 'Buku ini sangat membantu saya, isinya lumayan lengkap dan membahas kasus lumayan detail' },
            { user: { nama: 'A. Hakim A.', jumlahUlasan: 2 }, rating: 4, createdAt: '2 bulan lalu', komentar: 'Penjelasannya mudah diikuti, cocok untuk pemula.' }
        ];
        const dummyRating = { rataRata: 4.5, totalUlasan: 2, distribusi: { 5: 1, 4: 1, 3: 0, 2: 0, 1: 0 } };

        res.render('mahasiswa/ulasan', {
            buku: dummyBuku,
            ulasans: dummyUlasans,
            rating: dummyRating
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// GET /buku/:id/ulasan/tulis
exports.getFormUlasan = async (req, res) => {
    try {
        const dummyBuku = { id: req.params.id, judul: 'Dasar dasar Penguasaan Pemrograman Web' };
        res.render('mahasiswa/tulisUlasan', {
            buku: dummyBuku
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// POST /buku/:id/ulasan
exports.createUlasan = async (req, res) => {
    try {
        const bookId = req.params.id;
        res.redirect(`/buku/${bookId}/ulasan`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Anda bisa menambahkan fungsi detail buku di sini juga
exports.getDetailBuku = async (req, res) => {
    // Logika untuk menampilkan halaman detailbuku.ejs
    // contoh: res.render('mahasiswa/detailbuku', { ...data... });
};

