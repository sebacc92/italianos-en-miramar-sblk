import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema.server";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  const tursoUrl = process.env.PRIVATE_TURSO_DATABASE_URL;
  const tursoToken = process.env.PRIVATE_TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("PRIVATE_TURSO_DATABASE_URL and PRIVATE_TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  const db = drizzle(client, { schema });

  console.log("Seeding language courses...");

  const data = [
    {
      nombre_curso: "Italiano Principiante",
      profesor: "Prof. Luciano Giacommi",
      horarios: "Miércoles y Jueves | 16:45 a 18:15",
      precio_socio: 25000,
      precio_no_socio: 30000,
      precio_inscripcion: 10000,
      displayOrder: 1,
    },
    {
      nombre_curso: "Italiano Intermedio",
      profesor: "Prof. Luciano Giacommi",
      horarios: "Lunes 16:45 a 18:15 | Jueves 15:00 a 16:30",
      precio_socio: 25000,
      precio_no_socio: 30000,
      precio_inscripcion: 10000,
      displayOrder: 2,
    },
    {
      nombre_curso: "Italiano Cittadinanza",
      profesor: "Prof. Luciano Giacommi",
      horarios: "Lunes y Miércoles | 15:00 a 16:30",
      precio_socio: 25000,
      precio_no_socio: 30000,
      precio_inscripcion: 10000,
      displayOrder: 3,
    },
    {
      nombre_curso: "Italiano Conversazione",
      profesor: "Prof.ssa Sandra Beraldo",
      horarios: "Martes y Viernes | 15:15 a 16:45",
      precio_socio: 25000,
      precio_no_socio: 30000,
      precio_inscripcion: 10000,
      displayOrder: 4,
    },
  ];

  await db.insert(schema.courses).values(data);
  console.log("Seeded courses successfuly");
  process.exit(0);
}

seed().catch(console.error);
