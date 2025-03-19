import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

// Create a Prisma Client instance
export const prisma = new PrismaClient();

// Create a function to get the Prisma instance
export const getPrisma = () => prisma;

// Create an Elysia plugin for database access
export const dbPlugin = new Elysia({ name: "db" }).decorate("db", prisma);

// Initialize database connection
export async function initDb() {
  console.log("Initializing database connection...");
  // Connect to the database
  await prisma.$connect();
  console.log("Database connection initialized");
}

// Clean up function for application shutdown
export async function cleanupDb() {
  await prisma.$disconnect();
}
