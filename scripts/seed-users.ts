import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import * as schema from '../src/db/schema.server';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const run = async () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error('TURSO_DATABASE_URL is missing');

  const client = createClient({
    url,
    authToken,
  });

  const db = drizzle(client, { schema });

  const hash = bcrypt.hashSync('Miramar2026*', 10);

  const usersToInsert = [
    { username: 'seba', passwordHash: hash },
    { username: 'luz', passwordHash: hash },
    { username: 'laura', passwordHash: hash },
  ];

  for (const user of usersToInsert) {
    await db.insert(schema.users).values(user).onConflictDoNothing();
  }

  console.log('Users seeded successfully');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
