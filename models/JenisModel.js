const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Jenis = sequelize.define('Jenis', {
    id_jenis: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_jenis: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    tableName: 'jenis',
    timestamps: false,
});

module.exports = { Jenis };
