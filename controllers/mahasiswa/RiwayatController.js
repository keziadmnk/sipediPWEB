// const { Peminjaman } = require("../../models/PeminjamanModel");
// const { Buku } = require("../../models/BukuModel");
// const { Pengguna } = require("../../models/PenggunaModel");
// const { Op } = require("sequelize");

// // Menampilkan halaman riwayat peminjaman mahasiswa
// const showRiwayatPeminjaman = async (req, res) => {
//   try {
//     // Ambil ID pengguna dari session/token
//     const id_pengguna =
//       req.user.id_pengguna ||
//       req.user.id ||
//       req.user.userId ||
//       req.user.username;

//     console.log("User ID untuk riwayat:", id_pengguna); // Debug log

//     if (!id_pengguna) {
//       return res.status(401).send("User tidak terautentikasi");
//     }

//     // Ambil semua data peminjaman mahasiswa dengan join ke tabel buku
//     const riwayatPeminjaman = await Peminjaman.findAll({
//       where: {
//         id_pengguna: id_pengguna,
//       },
//       include: [
//         {
//           model: Buku,
//           attributes: ["judul_buku"], // Ambil judul buku
//           required: true, // INNER JOIN
//         },
//       ],
//       order: [["tanggal_peminjaman", "DESC"]], // Urutkan berdasarkan tanggal peminjaman terbaru
//     });

//     // Update status peminjaman berdasarkan tanggal
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const updatedRiwayat = riwayatPeminjaman.map((peminjaman, index) => {
//       let status = peminjaman.status_peminjaman;

//       // Jika status masih "Dipinjam", cek apakah sudah terlambat
//       if (status === "Dipinjam") {
//         const tanggalWajib = new Date(peminjaman.tanggal_wajib_pengembalian);
//         tanggalWajib.setHours(0, 0, 0, 0);

//         if (today > tanggalWajib) {
//           status = "Terlambat";
//           // Optional: Update status di database
//           Peminjaman.update(
//             { status_peminjaman: "Terlambat" },
//             { where: { id_peminjaman: peminjaman.id_peminjaman } }
//           );
//         }
//       }

//       return {
//         no: index + 1,
//         id_peminjaman: peminjaman.id_peminjaman,
//         nomor_isbn: peminjaman.nomor_isbn,
//         judul_buku: peminjaman.Buku
//           ? peminjaman.Buku.judul_buku
//           : "Buku tidak ditemukan",
//         tanggal_peminjaman: formatTanggal(peminjaman.tanggal_peminjaman),
//         tanggal_wajib_pengembalian: formatTanggal(
//           peminjaman.tanggal_wajib_pengembalian
//         ),
//         tanggal_pengembalian: peminjaman.tanggal_pengembalian
//           ? formatTanggal(peminjaman.tanggal_pengembalian)
//           : "-",
//         status_peminjaman: status,
//         denda: peminjaman.denda || 0,
//       };
//     });

//     // Render halaman riwayat peminjaman
//     res.render("mahasiswa/riwayatpeminjaman", {
//       user: req.user,
//       riwayatPeminjaman: updatedRiwayat,
//     });
//   } catch (error) {
//     console.error("Error showing riwayat peminjaman:", error);
//     res.status(500).send("Terjadi kesalahan sistem: " + error.message);
//   }
// };

// // Fungsi helper untuk format tanggal
// const formatTanggal = (tanggal) => {
//   if (!tanggal) return "-";

//   const date = new Date(tanggal);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// // Menampilkan detail peminjaman
// const getDetailPeminjaman = async (req, res) => {
//   try {
//     const { id_peminjaman } = req.params;
//     const id_pengguna =
//       req.user.id_pengguna ||
//       req.user.id ||
//       req.user.userId ||
//       req.user.username;

//     // Ambil detail peminjaman dengan join ke buku dan pengguna
//     const detailPeminjaman = await Peminjaman.findOne({
//       where: {
//         id_peminjaman: id_peminjaman,
//         id_pengguna: id_pengguna, // Pastikan hanya bisa melihat detail peminjaman sendiri
//       },
//       include: [
//         {
//           model: Buku,
//           attributes: ["judul_buku", "pengarang", "penerbit", "tahun_terbit"],
//           required: true,
//         },
//         {
//           model: Pengguna,
//           attributes: ["nama_lengkap", "email"],
//           required: true,
//         },
//       ],
//     });

//     if (!detailPeminjaman) {
//       return res.status(404).json({
//         success: false,
//         message: "Data peminjaman tidak ditemukan",
//       });
//     }

//     // Hitung denda jika terlambat
//     let denda = 0;
//     if (
//       detailPeminjaman.status_peminjaman === "Terlambat" ||
//       (detailPeminjaman.tanggal_pengembalian &&
//         new Date(detailPeminjaman.tanggal_pengembalian) >
//           new Date(detailPeminjaman.tanggal_wajib_pengembalian))
//     ) {
//       const tanggalKembali = detailPeminjaman.tanggal_pengembalian
//         ? new Date(detailPeminjaman.tanggal_pengembalian)
//         : new Date();
//       const tanggalWajib = new Date(
//         detailPeminjaman.tanggal_wajib_pengembalian
//       );

//       const selisihHari = Math.ceil(
//         (tanggalKembali - tanggalWajib) / (1000 * 60 * 60 * 24)
//       );

//       if (selisihHari > 0) {
//         denda = selisihHari * 1000; // Denda Rp 1.000 per hari
//       }
//     }

//     const responseData = {
//       id_peminjaman: detailPeminjaman.id_peminjaman,
//       nomor_isbn: detailPeminjaman.nomor_isbn,
//       judul_buku: detailPeminjaman.Buku.judul_buku,
//       pengarang: detailPeminjaman.Buku.pengarang,
//       penerbit: detailPeminjaman.Buku.penerbit,
//       tahun_terbit: detailPeminjaman.Buku.tahun_terbit,
//       nama_peminjam: detailPeminjaman.Pengguna.nama_lengkap,
//       email_peminjam: detailPeminjaman.Pengguna.email,
//       tanggal_peminjaman: formatTanggal(detailPeminjaman.tanggal_peminjaman),
//       tanggal_wajib_pengembalian: formatTanggal(
//         detailPeminjaman.tanggal_wajib_pengembalian
//       ),
//       tanggal_pengembalian: detailPeminjaman.tanggal_pengembalian
//         ? formatTanggal(detailPeminjaman.tanggal_pengembalian)
//         : null,
//       status_peminjaman: detailPeminjaman.status_peminjaman,
//       denda: denda,
//     };

//     res.json({
//       success: true,
//       data: responseData,
//     });
//   } catch (error) {
//     console.error("Error getting detail peminjaman:", error);
//     res.status(500).json({
//       success: false,
//       message: "Terjadi kesalahan sistem: " + error.message,
//     });
//   }
// };

// module.exports = {
//   showRiwayatPeminjaman,
//   getDetailPeminjaman,
// };
