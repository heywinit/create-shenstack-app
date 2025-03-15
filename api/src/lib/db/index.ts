import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create the database connection
const sql = postgres(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Create a function to get the database instance
export const getDb = () => db;

// Create an Elysia plugin for database access
export const dbPlugin = new Elysia({ name: "db" }).decorate("db", db);

// Initialize database with migration
export async function initDb() {
  console.log("Initializing database...");
  // await migrate(db, { migrationsFolder: './drizzle' })
}
