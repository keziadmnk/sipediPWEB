const { Sequelize } = require("sequelize");

const dialect = "mysql";
const username = "root";
const password = "";
const host = "localhost";
const dbname = "sipedi";

const dbUrl = `${dialect}://${username}:${password}@${host}/${dbname}`;
// dbUrl = `mysql://root:@localhost/sipedi`;

const sequelize = new Sequelize(dbUrl);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports =  sequelize;
