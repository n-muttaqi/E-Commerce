// database/connection.js
const mysql2 = require("mysql2");
require("dotenv").config(); // Load .env variables

// Determine whether to use local or remote DB
const useLocalhost = process.env.USE_LOCALHOST === "true";

let connectionParams;

if (useLocalhost) {
  console.log("🖥️  Using LOCAL MySQL connection...");
  connectionParams = {
    host: process.env.DB_SERVER_HOST || "127.0.0.1", // IPv4 prevents ::1 issues
    port: Number(process.env.DB_SERVER_PORT || 3306),
    user: process.env.DB_SERVER_USER || "root",
    password: process.env.DB_SERVER_PASSWORD || "",
    database: process.env.DB_SERVER_DATABASE || "e_commerce",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
} else {
  console.log("🌐 Using SERVER MySQL connection...");
  connectionParams = {
    host: process.env.DB_SERVER_HOST,
    port: Number(process.env.DB_SERVER_PORT || 3306),
    user: process.env.DB_SERVER_USER,
    password: process.env.DB_SERVER_PASSWORD,
    database: process.env.DB_SERVER_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

// Create a connection pool
const pool = mysql2.createPool(connectionParams);

// Verify connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
    connection.release();
  }
});

// Export promise-based pool (for async/await)
module.exports = pool.promise();
