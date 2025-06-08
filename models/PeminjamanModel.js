const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Pengguna = require("./PenggunaModel");

const Peminjaman = sequelize.define('Peminjaman', {
    id_peminjaman: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_pengguna: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    nomor_isbn: {
        type: DataTypes.STRING(20),
    },
    tanggal_peminjaman: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_wajib_pengembalian: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_pengembalian: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status_peminjaman: {
        type: DataTypes.ENUM('Dipinjam', 'Dikembalikan', 'Terlambat'),
        allowNull: false,
    },
    denda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,}
}, 
{
    tableName: 'peminjaman',
    timestamps: false,
});


module.exports = { Peminjaman };