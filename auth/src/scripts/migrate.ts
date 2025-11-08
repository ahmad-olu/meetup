import { migrate } from "drizzle-orm/node-postgres/migrator";
import { database, pool } from "../db";

async function main() {
  await migrate(database, { migrationsFolder: "drizzle" });
  await pool.end();
}

main();
