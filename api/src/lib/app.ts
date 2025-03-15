import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { dbPlugin } from "./db";

// Create the central Elysia instance with common plugins
export const app = new Elysia()
  .use(cors())
  .use(dbPlugin)
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "super-secret",
      exp: "7d",
    })
  );
