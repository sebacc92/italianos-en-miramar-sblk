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
  await client.execute("DROP TABLE IF EXISTS `arte_cursos`;");
  await client.execute("DROP TABLE IF EXISTS `nutricion_profesionales`;");
  console.log("Dropped arte_cursos and nutricion_profesionales tables to allow structural changes.");
  process.exit(0);
}

drop().catch(console.error);
