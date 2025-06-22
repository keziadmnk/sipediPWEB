const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_role'
    },
    nama_role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nama_role'
    },
  },
  {
    tableName: "role",
    timestamps: false,
  }
);

module.exports = { Role };
