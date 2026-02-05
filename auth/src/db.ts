import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "././db/schema";
import { Pool } from "pg";

export const db = drizzle(process.env.DATABASE_URL!);

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const database = drizzle({ schema, client: pool });

export { database, pool };
