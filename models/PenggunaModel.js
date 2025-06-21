const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Pengguna = sequelize.define('Pengguna',{
    id_pengguna: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
         type: DataTypes.STRING(100),
        allowNull: false
    },
    nama_lengkap: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nomor_hp: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
    }
    }, 
    {
    tableName: 'pengguna',
    timestamps: false
});


module.exports = { Pengguna };