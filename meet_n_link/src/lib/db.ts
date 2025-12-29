import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { Pool } from 'pg';
import { relations } from './relations';

export const db = drizzle({ connection: process.env.DATABASE_URL!, schema, relations });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const database = drizzle({ client: pool, schema, relations });

export { database, pool };
