const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BukuJenis = sequelize.define('BukuJenis', {
    nomor_isbn: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    id_jenis: {
        type: DataTypes.STRING(20),
        primaryKey: true
    }
}, {
    tableName: 'buku_jenis',
    timestamps: false,
});

module.exports = { BukuJenis };
