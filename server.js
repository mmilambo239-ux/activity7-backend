require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const guide = require("./guide");

const app = express();
app.set("trust proxy", 1);

const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",").map((value) => value.trim()).filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.type("html").send(guide(`${req.protocol}://${req.get("host")}`));
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(503).json({ message: "Database check failed." });
  }
});

app.use("/api/records", require("./routes/records"));

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error handler (four parameters)
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON in the request body." });
  }
  if (error.type === "entity.too.large") {
    return res.status(400).json({ message: "The request body is too large." });
  }
  console.error("Server error:", error);
  res.status(500).json({ message: "Unexpected server error. Please try again." });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
