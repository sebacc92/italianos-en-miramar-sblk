import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { arteCursos } from "~/db/schema.server";
import { asc } from "drizzle-orm";
import { PageHero } from "~/components/ui/PageHero";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { LuClock, LuCalendar, LuBrush } from "@qwikest/icons/lucide";

export const useArteCursos = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(arteCursos).orderBy(asc(arteCursos.id));
  return data;
});

export default component$(() => {
  const cursos = useArteCursos();

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Taller de Arte"
        description="Expresá tu creatividad en todas nuestras opciones artísticas guiadas por profesionales."
        bgImageUrl="/images/exterior_institucion.webp" 
      />

      {/* Main Content */}
      <main class="container mx-auto px-4 py-16">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-800">Nuestros Talleres</h2>
          <div class="mx-auto h-1 w-20 rounded bg-green-600"></div>
          <p class="mx-auto mt-4 max-w-2xl text-gray-600">
            Descubrí la variedad de talleres que ofrecemos. Todas las edades y niveles.
          </p>
        </div>

        {cursos.value.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-lg text-gray-500">Próximamente publicaremos los horarios de los talleres.</p>
          </div>
        ) : (
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:mx-10">
            {cursos.value.map((curso) => (
              <div
                key={curso.id}
                class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-200"
              >
                {/* Cabecera del Curso */}
                <div class="bg-indigo-50/50 p-6 border-b border-indigo-100 relative overflow-hidden">
                  <div class="absolute -right-4 -top-4 opacity-5">
                     <LuBrush class="h-32 w-32" />
                  </div>
                  <h3 class="relative text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {curso.nombre}
                  </h3>
                </div>

                {/* Detalles del Curso */}
                <div class="flex flex-1 flex-col p-6 space-y-4">
                   <div class="flex items-center text-gray-700">
                      <LuCalendar class="mr-3 h-5 w-5 text-indigo-500" />
                      <span class="font-medium text-base">{curso.dia_semana}</span>
                   </div>
                   <div class="flex items-center text-gray-700">
                      <LuClock class="mr-3 h-5 w-5 text-indigo-500" />
                      <span class="font-medium text-base">{curso.hora_inicio} a {curso.hora_fin}</span>
                   </div>

                   {/* Divider */}
                   <div class="border-t border-gray-100 pt-4 mt-2 flex-grow">
                     <div class="prose prose-sm text-gray-600" dangerouslySetInnerHTML={curso.descripcion} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Taller de Arte - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Conocé todos los talleres de arte, pintura y creatividad en el Círculo Italiano de Miramar.",
    },
  ],
};

export const onStaticGenerate = generateI18nPaths;
