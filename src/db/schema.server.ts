import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
import { sql, type InferSelectModel } from "drizzle-orm";

// ==========================================
// TABLAS DEL CMS (Base de datos propia Turso)
// ==========================================

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
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
  description: text("description"), // Richterxt / HTML content
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  eventDate: text("event_date"), // ISO 8601 string or simple formatted date
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type Event = InferSelectModel<typeof events>;

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(), // e.g. italiano-1-inicial
  language: text("language", { enum: ["es", "it"] }).notNull().default("es"),
  courseLanguage: text("course_language").notNull(), // 'italiano', 'ingles'
  title: text("title").notNull(),
  level: text("level").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  features: text("features", { mode: "json" }), // array of features
  schedule: text("schedule"),
  teacher: text("teacher"),
  isHighlight: integer("is_highlight", { mode: "boolean" }).default(false),
  badge: text("badge"),
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