import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { events, courses, danzasCronograma, arteCursos, nutricionProfesionales, autoridades } from "~/db/schema.server";
import { count } from "drizzle-orm";

export const head: DocumentHead = {
  title: "Dashboard — Admin | Círculo Italiano",
};

export const useDashboardStats = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  
  const [
    eventosCount,
    cursosCount,
    danzasCount,
    arteCount,
    nutricionCount,
    autoridadesCount,
  ] = await Promise.all([
    db.select({ value: count() }).from(events),
    db.select({ value: count() }).from(courses),
    db.select({ value: count() }).from(danzasCronograma),
    db.select({ value: count() }).from(arteCursos),
    db.select({ value: count() }).from(nutricionProfesionales),
    db.select({ value: count() }).from(autoridades),
  ]);

  return {
    eventos: eventosCount[0].value,
    cursos: cursosCount[0].value,
    danzas: danzasCount[0].value,
    arte: arteCount[0].value,
    nutricion: nutricionCount[0].value,
    autoridades: autoridadesCount[0].value,
  };
});

export default component$(() => {
  const stats = useDashboardStats();
  const userName = "Administrador";

  return (
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 class="text-3xl font-black text-gray-900">
          ¡Hola, <span class="capitalize text-green-600">{userName}</span>!
        </h1>
        <p class="mt-2 text-gray-600">
          Bienvenido al panel de administración del Círculo Italiano. Aquí un resumen del sistema.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.autoridades}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Autoridades
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.eventos}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Eventos Activos
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.cursos}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Cursos Idiomas
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.danzas}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Clases de Danza
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.nutricion}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Nutricionistas
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">{stats.value.arte}</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Talleres de Arte
          </span>
        </div>
      </div>
    </div>
  );
});
