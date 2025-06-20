const { Sequelize } = require("sequelize");
const { Buku } = require("../../models/BukuModel");
const { Peminjaman } = require("../../models/PeminjamanModel");
const { Pengguna } = require("../../models/PenggunaModel");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const findAllDenda = async (req, res) => {
  try {
    const datadenda = await Peminjaman.findAll({
      where: {
        status_peminjaman: "Terlambat",
        denda: {
          [Sequelize.Op.gt]: 0,
        },
      },

      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap"],
        },
        {
          model: Buku,
          attributes: ["nomor_isbn", "judul_buku"],
        },
      ],
    });

    res.render("petugas/denda", { datadenda });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findDetailDenda = async (req, res) => {
  try {
    const { id_peminjaman } = req.params;
    const datadenda = await Peminjaman.findOne({
      where: { id_peminjaman: id_peminjaman },
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap", "email"],
        },
        {
          model: Buku,
          attributes: [
            "nomor_isbn",
            "judul_buku",
            "pengarang",
            "lokasi_penyimpanan",
          ],
        },
      ],
    });
    if (!datadenda) {
      return res.status(404).send("Data Denda tidak ditemukan");
    }
    console.log(datadenda);
    res.render("petugas/detaildenda", { datadenda });
  } catch (error) {
    console.error("Error fetching detail denda:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cetakDendaPdf = async (req, res) => {
  try {
    const datadenda = await Peminjaman.findAll({
      where: {
        status_peminjaman: "Terlambat",
        denda: {
          [Sequelize.Op.gt]: 0,
        },
      },
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap"],
        },
        {
          model: Buku,
          attributes: ["nomor_isbn", "judul_buku"],
        },
      ],
      order: [["id_peminjaman", "ASC"]],
    });

    const totalDenda = datadenda.reduce(
      (sum, item) => sum + parseFloat(item.denda),
      0
    );
    const formattedTotalDenda = `Rp${totalDenda
      .toFixed(0)
      .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".")}`;

    const petugas = await Pengguna.findOne({
      where: { id_pengguna: req.user.userId },
    });
    const namaPetugas = petugas ? petugas.nama_lengkap : "Petugas Perpustakaan";

    const logoSipediPath = path.join(
      __dirname,
      "../../public/images/logo-sipedi.png"
    );
    const logoSipediBase64 = fs.readFileSync(logoSipediPath, "base64");
    const logoSipediSrc = `data:image/png;base64,${logoSipediBase64}`;

    const logoUnandPath = path.join(
      __dirname,
      "../../public/images/logo-unand.png"
    );
    const logoUnandBase64 = fs.readFileSync(logoUnandPath, "base64");
    const logoUnandSrc = `data:image/png;base64,${logoUnandBase64}`;

    const cssPath = path.join(__dirname, "../../public/stylesheets/output.css");
    const tailwindCss = fs.readFileSync(cssPath, "utf8");

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Denda</title>
  <style>${tailwindCss}</style>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
    }
    @page {
      margin: 0.75in;
    }
  </style>
</head>
<body class="text-gray-900 text-sm">
  <header class="flex items-center justify-between">
    <img src="${logoUnandSrc}" alt="Logo Unand" class="h-24 w-24 object-contain">
    <div class="text-center flex-grow mx-4">
      <p class="text-[10px] font-bold uppercase">Kementerian Riset, Teknologi, dan Pendidikan Tinggi</p>
      <p class="text-base font-bold uppercase">UPT. Perpustakaan Universitas Andalas</p>
      <p class="text-xs uppercase">Gedung Perpustakaan, Kampus Unand Limau Manis Padang - 25163</p>
      <p class="text-xs">Telp/Fax: (0751) 72725 PABX : 235</p>
      <p class="text-xs">http://pustaka.unand.ac.id e-mail : Pustaka@unand.ac.id</p>
    </div>
    <img src="${logoSipediSrc}" alt="Logo SIPEDI" class="h-24 w-24 object-contain">
  </header>
  <hr class="border-t-2 border-black -mt-1">
  <hr class="border-t-[1px] border-black mt-1 mb-6">
  
  <main>
    <h1 class="text-center text-base font-bold uppercase mb-6 tracking-wide">Laporan Denda Keterlambatan Pengembalian Buku</h1>

    <table class="w-full border border-gray-400 text-xs text-left border-collapse">
      <thead>
        <tr class="bg-gray-200 text-gray-800">
          <th class="border border-gray-400 px-2 py-1 font-semibold">ID Peminjaman</th>
          <th class="border border-gray-400 px-2 py-1 font-semibold">Nama Mahasiswa</th>
          <th class="border border-gray-400 px-2 py-1 font-semibold">Judul Buku</th>
          <th class="border border-gray-400 px-2 py-1 font-semibold">Tanggal Peminjaman</th>
          <th class="border border-gray-400 px-2 py-1 font-semibold">Tanggal Kembali</th>
          <th class="border border-gray-400 px-2 py-1 font-semibold">Denda</th>
        </tr>
      </thead>
      <tbody>
        ${datadenda
          .map(
            (p, i) => `
          <tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50"}">
            <td class="border border-gray-400 px-2 py-1">${p.id_peminjaman}</td>
            <td class="border border-gray-400 px-2 py-1">${
              p.Pengguna.nama_lengkap
            }</td>
            <td class="border border-gray-400 px-2 py-1">${
              p.Buku.judul_buku
            }</td>
            <td class="border border-gray-400 px-2 py-1">${new Date(
              p.tanggal_peminjaman
            ).toLocaleDateString("id-ID")}</td>
            <td class="border border-gray-400 px-2 py-1">${
              p.tanggal_pengembalian
                ? new Date(p.tanggal_pengembalian).toLocaleDateString("id-ID")
                : "-"
            }</td>
            <td class="border border-gray-400 px-2 py-1">Rp${parseFloat(p.denda)
              .toFixed(0)
              .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </main>

  <footer class="mt-12 text-xs">
    <div class="flex justify-end mt-6">
      <div class="w-1/3 text-right mr-2">
        <p class="font-semibold">Total Denda: <span class="text-red-600 font-bold">${formattedTotalDenda}</span></p>
      </div>
    </div>
    <div class="flex justify-end mt-8">
      <div class="w-1/3 text-right">
        <p class="mb-16">Padang, ${new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</p>
        <p class="font-bold underline">${namaPetugas}</p>
        <p>Petugas Perpustakaan</p>
      </div>
    </div>
  </footer>
</body>
</html>
`;

    const browser = await puppeteer.launch();
    const halaman = await browser.newPage();
    await halaman.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await halaman.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
      "Content-Disposition": 'attachment; filename="laporan-denda.pdf"',
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Gagal membuat laporan PDF denda:", error);
    res.status(500).send("Gagal membuat laporan PDF.");
  }
};

module.exports = { findAllDenda, findDetailDenda, cetakDendaPdf };
