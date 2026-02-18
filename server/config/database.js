const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

if (process.env.DB_DIALECT === "mysql") {
  // Production: MySQL (Hostinger)
  sequelize = new Sequelize(
    process.env.DB_NAME || "watch_store",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306"),
      dialect: "mysql",
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
      logging: false,
    }
  );
} else {
  // Local dev: SQLite (zero-config)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "database.sqlite"),
    logging: false,
  });
}

module.exports = sequelize;
