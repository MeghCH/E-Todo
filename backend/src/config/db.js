const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_ROOT_PASSWORD || "password",
  database: process.env.MYSQL_DATABASE || "etodo",
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

db.on('connection', (connection) => {
  console.log('Database connected');
  connection.on('error', (err) => {
    console.error('Database connection error:', err);
    if (err.code === 'ECONNRESET') {
      console.log('Connection reset, attempting to reconnect...');
    }
  });
});

db.on('error', (err) => {
  console.error('Pool error:', err);
});

module.exports = db;
