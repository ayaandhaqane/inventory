import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});



import express from "express";
import productRoutes from "./routes/productRoutes";
import pool from "./database/connection";
import categoryRoutes from "./routes/categoryRoutes"


const app = express();
const port = process.env.PORT || 8000;

// Enable CORS middleware
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

// Ensure required database tables exist before starting server
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

// Run DB setup AFTER server starts
async function ensureTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
        image TEXT,
        quantity INTEGER NOT NULL CHECK (quantity >= 0)
      );
    `);
    console.log("Database tables ensured");
  } catch (error) {
    console.error("Database setup failed:", error);
  }
}

ensureTables();
