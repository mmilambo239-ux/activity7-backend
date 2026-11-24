require("dotenv").config();
const { Pool } = require("pg");

const url = process.env.DATABASE_URL;
const isLocal = !url || /localhost|127\.0\.0\.1/.test(url);

// Hosted databases (such as Render) need SSL; a local PostgreSQL does not.
const pool = new Pool({
  connectionString: url,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on("error", (error) => console.error("Unexpected database error:", error.message));

module.exports = pool;
