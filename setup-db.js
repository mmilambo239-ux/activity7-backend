// Creates the table and inserts the starting records. Run with: npm run setup
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./db");

(async () => {
  try {
    for (const file of ["schema.sql", "seed.sql"]) {
      await pool.query(fs.readFileSync(path.join(__dirname, file), "utf8"));
      console.log("Ran " + file);
    }
    const result = await pool.query("SELECT COUNT(*) FROM records");
    console.log("Records in table: " + result.rows[0].count);
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
