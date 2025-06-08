const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Kategori = sequelize.define('Kategori', {
    id_kategori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_kategori: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'kategori',
    timestamps: false,
});

module.exports = { Kategori };