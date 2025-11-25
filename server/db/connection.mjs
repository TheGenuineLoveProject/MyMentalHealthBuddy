// server/db/connection.mjs
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema.mjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 5
});

export const db = drizzle(client, { schema });
export default db;