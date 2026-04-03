import { createClient } from "@libsql/client";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

async function drop() {
  const tursoUrl = process.env.PRIVATE_TURSO_DATABASE_URL;
  const tursoToken = process.env.PRIVATE_TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("PRIVATE_TURSO_DATABASE_URL and PRIVATE_TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  await client.execute("DROP TABLE IF EXISTS `courses`;");
  console.log("Dropped courses table.");
  process.exit(0);
}

drop().catch(console.error);
