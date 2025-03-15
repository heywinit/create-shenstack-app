import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { swagger } from "@elysiajs/swagger";
import { initDb } from "./lib/db";
import { auth } from "./routes/auth";
import { app } from "./lib/app";
import { users } from "./routes/users";

// Initialize database
await initDb();

// Add remaining plugins and routes
app
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
  .use(auth)
  .use(users)
  .get("/", () => ({ message: "SHENSTACK API is running" }));

// Start the server
app.listen(3001, () => {
  console.log("🚀 SHENSTACK API running at http://localhost:3001");
});

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
