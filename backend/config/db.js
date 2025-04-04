const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkDBConnection() {
    console.log(pool)
    try {
      const connection = await pool.getConnection();
      console.log("✅ Database connected successfully!");
      connection.release(); // Release connection back to pool
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      process.exit(1); // Exit the process if DB connection fails
    }
  }
  
  // Run the connection check
  checkDBConnection();

module.exports = pool;