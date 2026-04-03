import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { sql, type InferSelectModel } from "drizzle-orm";

// ==========================================
// TABLAS DEL CMS (Base de datos propia Turso)
// ==========================================

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "DANZAS", "NUTRICION", "ARTE"] }).notNull().default("ADMIN"),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  language: text("language", { enum: ["es", "it"] }).notNull().default("es"),
  title: text("title").notNull(),
  description: text("description"), // HTML content
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  eventDate: text("event_date"), // ISO 8601 string
  gallery: text("gallery", { mode: "json" }), // array of URLs
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type Event = InferSelectModel<typeof events>;

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre_curso: text("nombre_curso").notNull(),
  profesor: text("profesor").notNull(),
  horarios: text("horarios").notNull(),
  precio_socio: integer("precio_socio").notNull(),
  precio_no_socio: integer("precio_no_socio").notNull(),
  precio_inscripcion: integer("precio_inscripcion").notNull(),
  displayOrder: integer("display_order").default(0),
});

export type Course = InferSelectModel<typeof courses>;

// Used for "Salones", "Cultura", "Escuela de Danzas"
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  language: text("language", { enum: ["es", "it"] }).notNull().default("es"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // e.g. 'salon', 'cultura'
  ctaText: text("cta_text"),
  link: text("link").notNull(), // external or internal link
  isExternal: integer("is_external", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
});

export type Service = InferSelectModel<typeof services>;

export const preinscripciones = sqliteTable("preinscripciones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono"),
  curso: text("curso").notNull(),
  estado: text("estado").default("pendiente"),
  fecha_creacion: integer("fecha_creacion", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const reservas_salones = sqliteTable("reservas_salones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono"),
  tipo_evento: text("tipo_evento").notNull(),
  salon: text("salon").notNull(),
  fecha_estimada: text("fecha_estimada").notNull(),
  mensaje: text("mensaje"),
  estado: text("estado").default("pendiente"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const solicitudes_asociacion = sqliteTable("solicitudes_asociacion", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  dni: text("dni").notNull().unique(),
  fecha_nacimiento: text("fecha_nacimiento").notNull(),
  nacionalidad: text("nacionalidad").notNull(),
  email: text("email").notNull().unique(),
  telefono: text("telefono").notNull(),
  domicilio: text("domicilio").notNull(),
  ciudad: text("ciudad").notNull(),
  codigo_postal: text("codigo_postal"),
  profesion: text("profesion"),
  estado_civil: text("estado_civil"),
  tiene_ascendencia_italiana: integer("tiene_ascendencia_italiana", { mode: "boolean" }).default(false),
  socio_presentante_1: text("socio_presentante_1"),
  socio_presentante_2: text("socio_presentante_2"),
  motivo_asociacion: text("motivo_asociacion"),
  estado: text("estado").default("pendiente"),
  fecha_solicitud: integer("fecha_solicitud", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  idx_solicitudes_fecha: index("idx_solicitudes_fecha").on(table.fecha_solicitud),
  idx_solicitudes_estado: index("idx_solicitudes_estado").on(table.estado),
}));

// ==========================================
// NUEVO MÓDULO: DANZAS
// ==========================================

export const danzasCronograma = sqliteTable("danzas_cronograma", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clase: text("clase").notNull(),
  categoria: text("categoria").notNull(),
  profesores: text("profesores").notNull(),
  dia_semana: text("dia_semana").notNull(),
  hora_inicio: text("hora_inicio").notNull(),
  hora_fin: text("hora_fin").notNull(),
  salon: integer("salon").notNull(),
});

export const danzasGaleria = sqliteTable("danzas_galeria", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export type DanzaCronograma = InferSelectModel<typeof danzasCronograma>;
export type DanzaGaleria = InferSelectModel<typeof danzasGaleria>;

// ==========================================
// NUEVO MÓDULO: NUTRICIÓN
// ==========================================

export const nutricionProfesionales = sqliteTable("nutricion_profesionales", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nombre: text("nombre").notNull(),
  descripcion_servicios: text("descripcion_servicios").notNull(),
  dia_semana: text("dia_semana").notNull(),
  hora_inicio: text("hora_inicio").notNull(),
  hora_fin: text("hora_fin").notNull(),
});

export type NutricionProfesional = InferSelectModel<typeof nutricionProfesionales>;

// ==========================================
// NUEVO MÓDULO: ARTE
// ==========================================

export const arteCursos = sqliteTable("arte_cursos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  dia_semana: text("dia_semana").notNull(),
  hora_inicio: text("hora_inicio").notNull(),
  hora_fin: text("hora_fin").notNull(),
  descripcion: text("descripcion").notNull(),
});

export type ArteCurso = InferSelectModel<typeof arteCursos>;

// ==========================================
// AUTORIDADES
// ==========================================
export const autoridades = sqliteTable("autoridades", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  nombre: text("nombre").notNull(),
  cargo: text("cargo").notNull(),
});

export type Autoridad = InferSelectModel<typeof autoridades>;

// ==========================================
// CIUDADANÍA
// ==========================================
export const ciudadania = sqliteTable("ciudadania", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  dia_hora: text("dia_hora").notNull(),
  nombre_asesora: text("nombre_asesora"),
});

export type Ciudadania = InferSelectModel<typeof ciudadania>;

// ==========================================
// CONFIGURACIÓN DE DANZAS
// ==========================================
export const danzasConfig = sqliteTable("danzas_config", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  pdf_url: text("pdf_url").notNull(),
});

export type DanzasConfig = InferSelectModel<typeof danzasConfig>;

// ==========================================
// EXPOSICIONES
// ==========================================
export const exposiciones = sqliteTable("exposiciones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  titulo: text("titulo").notNull(),
  fecha_inauguracion: text("fecha_inauguracion").notNull(),
  nombre_artista: text("nombre_artista").notNull(),
  contacto_artista: text("contacto_artista").notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type Exposicion = InferSelectModel<typeof exposiciones>;

export const exposicionesObras = sqliteTable("exposiciones_obras", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  exposicion_id: text("exposicion_id").notNull().references(() => exposiciones.id, { onDelete: 'cascade' }),
  image_url: text("image_url").notNull(),
  titulo_obra: text("titulo_obra"),
  descripcion_obra: text("descripcion_obra"),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type ExposicionObra = InferSelectModel<typeof exposicionesObras>;