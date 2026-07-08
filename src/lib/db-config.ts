import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "@/schema";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL! });

export const db = drizzle(pool, { schema });
