import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config;
