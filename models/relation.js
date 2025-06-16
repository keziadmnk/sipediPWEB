const { Buku } = require("./BukuModel");
const { Peminjaman } = require("./PeminjamanModel");
const { Pengguna } = require("./PenggunaModel");
const { Role } = require("./RoleModel");  
const { Kategori } = require("./KategoriModel");
const { BukuKategori } = require("./BukuKategoriModel");



Role.hasMany(Pengguna, { foreignKey: 'id_role' });
Pengguna.hasMany(Peminjaman, { foreignKey: 'id_pengguna' });
Pengguna.belongsTo(Role, { foreignKey: 'id_role' });
Buku.hasMany(Peminjaman, { foreignKey: 'nomor_isbn' });
Peminjaman.belongsTo(Pengguna, { foreignKey: 'id_pengguna' });
Peminjaman.belongsTo(Buku, { foreignKey: 'nomor_isbn' });
Buku.belongsToMany(Kategori, { through: BukuKategori, foreignKey: 'nomor_isbn' });
Kategori.belongsToMany(Buku, { through: BukuKategori, foreignKey: 'id_kategori' });


module.exports = {
  Buku, Peminjaman, Pengguna, Kategori, Role, BukuKategori
};

