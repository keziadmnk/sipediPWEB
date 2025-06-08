const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "role",
    timestamps: false,
  }
);


module.exports = { Role };
