const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ulasan = sequelize.define('Ulasan', {
  id_ulasan: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nomor_isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'buku',
      key: 'nomor_isbn'
    }
  },
  id_pengguna: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'pengguna',
      key: 'id_pengguna'
    }
  },
  isi_ulasan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'ulasan',
  timestamps: true,

  uniqueKeys: {
    unique_ulasan_per_buku_pengguna: {
      fields: ['nomor_isbn', 'id_pengguna']
    }
  }
});

module.exports = { Ulasan };