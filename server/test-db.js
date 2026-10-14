
import "dotenv/config";
import { testConnection, pool } from "./db.js";

async function main() {
  try {
    await testConnection();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
