import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle>;

// Initialize database connection
export function getDb() {
  if (!db) {
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzle(sql, { schema });
  }
  return db;
}

// Initialize database with migration
export async function initDb() {
  console.log("Initializing database...");
  // In a real app, you would run migrations here using:
  // await migrate(db, { migrationsFolder: './drizzle' })
}
