const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Buku } = require("./BukuModel");

const BukuKategori = sequelize.define(
  "BukuKategori",
  {
    nomor_isbn: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    id_kategori: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "buku_kategori",
    timestamps: false,
  }
);

module.exports = { BukuKategori }; 