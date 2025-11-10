// backend/src/db.js
import "dotenv/config";
import mysql from "mysql2/promise";

/**
 * Connection pool.
 * Adjust defaults or put values in backend/.env:
 *   DB_HOST=localhost
 *   DB_USER=root
 *   DB_PASS=
 *   DB_NAME=multiplesclerosisdb
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "multiplesclerosisdb",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4_general_ci",
});

export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
