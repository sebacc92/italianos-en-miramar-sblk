import { createClient } from "@libsql/client/web";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const indexes = await client.execute("SELECT name FROM sqlite_master WHERE type='index';");
  console.log("Indexes in sqlite:", indexes.rows);

  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log("Tables in sqlite:", tables.rows);
  
  // Try to create the index to appease drizzle
  try {
     console.log("Creating missing index to appease drizzle...");
     await client.execute("CREATE UNIQUE INDEX IF NOT EXISTS `users_username_unique` ON `users` (`username`);");
     console.log("Index created!");
  } catch (err) {
     console.log("Error creating index:", err);
  }
}

main().catch(console.error);
