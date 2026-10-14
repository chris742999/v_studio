
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from your .env file");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected database connection error:", err.message);
});

export async function testConnection() {
  const result = await pool.query("SELECT NOW() AS current_time");

  console.log("Database connected successfully!");
  console.log("Database time:", result.rows[0].current_time);
}
