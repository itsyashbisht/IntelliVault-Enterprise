import * as schema from "@/schema";
import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL! });

export const db = drizzle(pool, { schema });
