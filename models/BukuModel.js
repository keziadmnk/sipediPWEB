const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Buku = sequelize.define('Buku', {
    nomor_isbn: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    judul_buku: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pengarang: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    penerbit: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tahun_terbit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    jumlah_halaman: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jumlah_stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lokasi_penyimpanan: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    upload_pdf: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    upload_sampul: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'kategori',
            key: 'id_kategori'
        }
    }
}, {
    tableName: 'buku',
    timestamps: false,
});


module.exports = { Buku };