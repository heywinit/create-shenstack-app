import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;
