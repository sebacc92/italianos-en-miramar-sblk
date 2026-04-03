import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema.server";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

async function seedDanzasReal() {
  const tursoUrl = process.env.PRIVATE_TURSO_DATABASE_URL;
  const tursoToken = process.env.PRIVATE_TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("PRIVATE_TURSO_DATABASE_URL and PRIVATE_TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  const db = drizzle(client, { schema });

  console.log("Seeding real danzas schedules...");

  const data = [
    // LUNES - SALÓN 1
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '15:15', hora_fin: '16:15', categoria: 'JUVENIL 3', clase: 'Urbano', profesores: 'Candela' },
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '16:15', hora_fin: '17:15', categoria: 'JUVENIL 2', clase: 'Urbano', profesores: 'Candela' },
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '17:30', hora_fin: '18:30', categoria: 'JUVENIL 2 y 3', clase: 'Improvisación', profesores: 'Flor' },
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '18:30', hora_fin: '19:30', categoria: 'INFANTIL 1 y 2', clase: 'Ritmos', profesores: 'Flor y Feli' },
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '19:30', hora_fin: '20:30', categoria: 'INFANTIL 3, 4, 5 y 6', clase: 'Ritmos', profesores: 'Flor y Feli' },
    { dia_semana: 'Lunes', salon: 1, hora_inicio: '20:30', hora_fin: '21:30', categoria: '+18', clase: 'Ritmos Coreogr.', profesores: 'Flor' },
    // LUNES - SALÓN 2
    { dia_semana: 'Lunes', salon: 2, hora_inicio: '15:30', hora_fin: '16:30', categoria: '+18 AVANZADO', clase: 'Expresión', profesores: 'Paz' },
    { dia_semana: 'Lunes', salon: 2, hora_inicio: '16:30', hora_fin: '17:30', categoria: 'JUVENIL 3', clase: 'Expresión', profesores: 'Paz' },
    { dia_semana: 'Lunes', salon: 2, hora_inicio: '17:30', hora_fin: '18:30', categoria: 'JUVENIL 1 + INF 6', clase: 'Urbano', profesores: 'Candela' },
    { dia_semana: 'Lunes', salon: 2, hora_inicio: '18:30', hora_fin: '19:30', categoria: 'JUVE 1 y 2 + INF 6', clase: 'Expresión', profesores: 'Paz' },
    { dia_semana: 'Lunes', salon: 2, hora_inicio: '19:30', hora_fin: '21:00', categoria: '+18', clase: 'DTM', profesores: 'Paz, Germán y Nahuel' },
    // MARTES - SALÓN 1
    { dia_semana: 'Martes', salon: 1, hora_inicio: '15:00', hora_fin: '16:00', categoria: 'JUVENIL 2 y 3', clase: 'Fusión', profesores: 'Anto' },
    { dia_semana: 'Martes', salon: 1, hora_inicio: '16:00', hora_fin: '17:00', categoria: 'JUVENIL 1, 2 y 3', clase: 'DEDAM', profesores: 'Anto' },
    { dia_semana: 'Martes', salon: 1, hora_inicio: '17:30', hora_fin: '18:15', categoria: 'MINI 3 Y 4', clase: 'Iniciación', profesores: 'Paz, Dai y Ro' },
    { dia_semana: 'Martes', salon: 1, hora_inicio: '18:30', hora_fin: '19:30', categoria: 'JUVENIL 3', clase: 'Jazz', profesores: 'Nico y Diego' },
    { dia_semana: 'Martes', salon: 1, hora_inicio: '20:30', hora_fin: '21:30', categoria: '+18', clase: 'Expresión', profesores: 'Paz' },
    // MARTES - SALÓN 2
    { dia_semana: 'Martes', salon: 2, hora_inicio: '15:00', hora_fin: '16:00', categoria: '+18', clase: 'Ritmos', profesores: 'Flor' },
    { dia_semana: 'Martes', salon: 2, hora_inicio: '16:30', hora_fin: '17:00', categoria: 'MINI 1 Y 2', clase: 'Iniciación', profesores: 'Paz y Flor' },
    { dia_semana: 'Martes', salon: 2, hora_inicio: '17:30', hora_fin: '18:15', categoria: 'MINI 5', clase: 'Iniciación', profesores: 'Flor' },
    { dia_semana: 'Martes', salon: 2, hora_inicio: '18:15', hora_fin: '20:15', categoria: 'INFANTIL 3 a 6', clase: 'DTM', profesores: 'Paz, Germán y Nahuel' },
    // MIÉRCOLES - SALÓN 1
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '15:00', hora_fin: '16:00', categoria: 'JUVENIL 1, 2 y 3', clase: 'OEDAM', profesores: 'Nico y Diego' },
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '16:00', hora_fin: '17:00', categoria: '+18 AVANZADO', clase: 'Jazz', profesores: 'Nico y Diego' },
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '17:30', hora_fin: '18:30', categoria: 'JUVENIL 1 + INF 6', clase: 'Jazz', profesores: 'Nico y Diego' },
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '18:30', hora_fin: '19:30', categoria: 'INFANTIL 1 y 2', clase: 'Ritmos', profesores: 'Paz' },
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '19:30', hora_fin: '20:30', categoria: 'INFANTIL 3, 4, 5 y 6', clase: 'Ritmos', profesores: 'Paz' },
    { dia_semana: 'Miércoles', salon: 1, hora_inicio: '20:30', hora_fin: '21:30', categoria: '+18', clase: 'Jazz', profesores: 'Nico y Diego' },
    // MIÉRCOLES - SALÓN 2
    { dia_semana: 'Miércoles', salon: 2, hora_inicio: '16:00', hora_fin: '17:15', categoria: 'JUVENIL 2', clase: 'Coreográfico', profesores: 'Paz' },
    { dia_semana: 'Miércoles', salon: 2, hora_inicio: '17:15', hora_fin: '18:30', categoria: 'JUVENIL 3', clase: 'Coreográfico', profesores: 'Paz' },
    { dia_semana: 'Miércoles', salon: 2, hora_inicio: '18:30', hora_fin: '20:30', categoria: 'JUVENILES', clase: 'DTM', profesores: 'Nico, Diego, Germán y Nahuel' },
    // JUEVES - SALÓN 1
    { dia_semana: 'Jueves', salon: 1, hora_inicio: '15:00', hora_fin: '16:00', categoria: '+18', clase: 'Fusión', profesores: 'Flor' },
    { dia_semana: 'Jueves', salon: 1, hora_inicio: '17:30', hora_fin: '18:15', categoria: 'MINI 3, 4 y 5', clase: 'Iniciación', profesores: 'Flor, Dai y Ro' },
    { dia_semana: 'Jueves', salon: 1, hora_inicio: '18:30', hora_fin: '19:30', categoria: 'JUVENIL 2 y 3', clase: 'Jazz', profesores: 'Nico y Diego' },
    { dia_semana: 'Jueves', salon: 1, hora_inicio: '20:30', hora_fin: '21:30', categoria: '+18 AVANZADO', clase: 'Urbano', profesores: 'Paz' },
    // JUEVES - SALÓN 2
    { dia_semana: 'Jueves', salon: 2, hora_inicio: '16:30', hora_fin: '17:00', categoria: 'MINI 1 Y 2', clase: 'Iniciación', profesores: 'Flor' },
    { dia_semana: 'Jueves', salon: 2, hora_inicio: '18:15', hora_fin: '20:00', categoria: 'MINI 5 + INF 1 y 2', clase: 'DTM', profesores: 'Paz, Germán y Nahuel' },
  ];

  await db.insert(schema.danzasCronograma).values(data);
  console.log("Seeded real danzas successfully.");
  process.exit(0);
}

seedDanzasReal().catch(console.error);
