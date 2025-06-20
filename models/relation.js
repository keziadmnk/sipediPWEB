const { Buku } = require("./BukuModel");
const { Peminjaman } = require("./PeminjamanModel");
const { Pengguna } = require("./PenggunaModel");
const { Role } = require("./RoleModel");  
const { Kategori } = require("./KategoriModel");
const { Jenis } = require("./JenisModel");
const { BukuJenis } = require("./BukuJenisModel");
const { Ulasan } = require("./UlasanModel");


Role.hasMany(Pengguna, { foreignKey: 'id_role' });
Pengguna.hasMany(Peminjaman, { foreignKey: 'id_pengguna' });
Pengguna.belongsTo(Role, { foreignKey: 'id_role' });
Buku.hasMany(Peminjaman, { foreignKey: 'nomor_isbn' });
Peminjaman.belongsTo(Pengguna, { foreignKey: 'id_pengguna' });
Peminjaman.belongsTo(Buku, { foreignKey: 'nomor_isbn' });

Pengguna.hasMany(Ulasan, { foreignKey: 'id_pengguna' });
Ulasan.belongsTo(Pengguna, { foreignKey: 'id_pengguna' });

Buku.hasMany(Ulasan, { foreignKey: 'nomor_isbn' });
Ulasan.belongsTo(Buku, { foreignKey: 'nomor_isbn' });

Buku.belongsTo(Kategori, {
    foreignKey: 'id_kategori',
    as: 'kategori'
});

Kategori.hasMany(Buku, {
    foreignKey: 'id_kategori',
    as: 'buku'
});


Buku.belongsToMany(Jenis, {
    through: BukuJenis,
    foreignKey: 'nomor_isbn',
    otherKey: 'id_jenis',
    as: 'jenis'
});
Jenis.belongsToMany(Buku, {
    through: BukuJenis,
    as: 'jenis',
    foreignKey: 'id_jenis',
    otherKey: 'nomor_isbn',
    as: 'buku'
});



module.exports = {
  Buku, Peminjaman, Pengguna, Kategori, Role, Jenis, BukuJenis, Ulasan
};