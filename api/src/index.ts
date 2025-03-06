import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { swagger } from "@elysiajs/swagger";
import { usersRoutes } from "./routes/users";
import { initDb } from "./lib/db";

// Initialize database
await initDb();

// Create the Elysia app
const app = new Elysia()
  .use(cors())
  .use(
    opentelemetry({
      spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "SHENSTACK API",
          version: "1.0.0",
        },
      },
    })
  )
  .get("/", () => ({ message: "SHENSTACK API is running" }))
  .group("/api", (app) => app.use(usersRoutes));

// Start the server
app.listen(3001, () => {
  console.log("🚀 SHENSTACK API running at http://localhost:3001");
});
