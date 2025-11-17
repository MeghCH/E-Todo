const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "meghan",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "etodo",
});

module.exports = db;
