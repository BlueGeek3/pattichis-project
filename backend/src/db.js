// import mysql from "mysql2/promise";
// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME,
//   connectionLimit: 10,
//   charset: "utf8mb4_general_ci",
// });

import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "multiplesclerosisdb",
});
