const { Buku } = require("./BukuModel");
const { Peminjaman } = require("./PeminjamanModel");
const { Pengguna } = require("./PenggunaModel");
const { Role } = require("./RoleModel");  
const { Kategori } = require("./KategoriModel");
const { Jenis } = require("./JenisModel");
const { BukuJenis } = require("./BukuJenisModel");


Role.hasMany(Pengguna, { foreignKey: 'id_role' });
Pengguna.hasMany(Peminjaman, { foreignKey: 'id_pengguna' });
Pengguna.belongsTo(Role, { foreignKey: 'id_role' });
Buku.hasMany(Peminjaman, { foreignKey: 'nomor_isbn' });
Peminjaman.belongsTo(Pengguna, { foreignKey: 'id_pengguna' });
Peminjaman.belongsTo(Buku, { foreignKey: 'nomor_isbn' });
Buku.belongsTo(Kategori, { foreignKey: 'id_kategori' });
Kategori.hasMany(Buku, { foreignKey: 'id_kategori' });
Buku.belongsToMany(Jenis, { through: BukuJenis, foreignKey: 'nomor_isbn' });
Jenis.belongsToMany(Buku, { through: BukuJenis, foreignKey: 'id_jenis' });


module.exports = {
  Buku, Peminjaman, Pengguna, Kategori, Role, Jenis,
};