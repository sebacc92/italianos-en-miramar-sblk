import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { arteCursos, arteConfig, arteGaleria } from "~/db/schema.server";
import { asc, eq, desc } from "drizzle-orm";
import { PageHero } from "~/components/ui/PageHero";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { LuClock, LuCalendar, LuBrush, LuPhone, LuCamera } from "@qwikest/icons/lucide";

export const useArteCursos = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(arteCursos).orderBy(asc(arteCursos.id));
  return data;
});

export const useArteConfig = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const configRaw = await db.select().from(arteConfig).where(eq(arteConfig.id, "1")).limit(1);
  const config = configRaw.length > 0 ? configRaw[0] : null;

  const galleryRaw = await db.select().from(arteGaleria).orderBy(desc(arteGaleria.createdAt));
  const galleryUrls = galleryRaw.map((g) => g.imageUrl);

  return { config, galleryUrls };
});

export default component$(() => {
  const cursos = useArteCursos();
  const dataConfig = useArteConfig();

  const config = dataConfig.value.config;
  const galleryUrls = dataConfig.value.galleryUrls;

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
          
          {config?.descripcion_libre ? (
            <div 
              class="prose prose-lg prose-green mx-auto mt-8 max-w-3xl text-left text-gray-600 md:text-center"
              dangerouslySetInnerHTML={config.descripcion_libre}
            />
          ) : (
            <p class="mx-auto mt-4 max-w-2xl text-gray-600">
              Descubrí la variedad de talleres que ofrecemos. Todas las edades y niveles.
            </p>
          )}
        </div>

        {/* Contact CTA */}
        {(config?.telefono_1 || config?.telefono_2) && (
          <div class="mx-auto mb-16 max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
             <div class="flex flex-col items-center justify-between gap-8 px-8 py-10 md:flex-row sm:px-12">
                <div class="text-center md:text-left">
                  <h3 class="mb-3 flex items-center justify-center text-3xl font-bold md:justify-start">
                    <LuPhone class="mr-3 h-8 w-8 opacity-90" />
                    ¿Querés anotarte?
                  </h3>
                  <p class="text-lg text-emerald-50">
                    Comunicate con nosotros a través de los siguientes números:
                  </p>
                </div>
                <div class="flex w-full min-w-[240px] flex-col gap-3 md:w-auto">
                   {config.telefono_1 && (
                     <a 
                       href={`https://wa.me/${config.telefono_1.replace(/\D/g, '')}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-8 py-4 text-lg font-semibold text-white shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/30 hover:shadow-md"
                     >
                       <span>{config.telefono_1}</span>
                     </a>
                   )}
                   {config.telefono_2 && (
                     <a 
                       href={`https://wa.me/${config.telefono_2.replace(/\D/g, '')}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-8 py-4 text-lg font-semibold text-white shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/30 hover:shadow-md"
                     >
                       <span>{config.telefono_2}</span>
                     </a>
                   )}
                </div>
             </div>
          </div>
        )}

        {cursos.value.length === 0 ? (
          <div class="py-12 text-center">
            <p class="text-lg text-gray-500">Próximamente publicaremos los horarios de los talleres.</p>
          </div>
        ) : (
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:mx-10 mb-20">
            {cursos.value.map((curso) => (
              <div
                key={curso.id}
                class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
              >
                {/* Cabecera del Curso */}
                <div class="relative overflow-hidden border-b border-indigo-100 bg-indigo-50/50 p-6">
                  <div class="absolute -right-4 -top-4 opacity-5">
                     <LuBrush class="h-32 w-32" />
                  </div>
                  <h3 class="relative text-2xl font-bold text-gray-900 transition-colors group-hover:text-indigo-700">
                    {curso.nombre}
                  </h3>
                </div>

                {/* Detalles del Curso */}
                <div class="flex flex-1 flex-col space-y-4 p-6">
                   <div class="flex items-center text-gray-700">
                      <LuCalendar class="mr-3 h-5 w-5 text-indigo-500" />
                      <span class="text-base font-medium">{curso.dia_semana}</span>
                   </div>
                   <div class="flex items-center text-gray-700">
                      <LuClock class="mr-3 h-5 w-5 text-indigo-500" />
                      <span class="text-base font-medium">{curso.hora_inicio} a {curso.hora_fin}</span>
                   </div>

                   {/* Divider */}
                   <div class="mt-2 flex-grow border-t border-gray-100 pt-4">
                     <div class="prose prose-sm text-gray-600" dangerouslySetInnerHTML={curso.descripcion} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GALERÍA DE IMÁGENES */}
        {galleryUrls && galleryUrls.length > 0 && (
          <div class="mt-16 xl:mx-10">
            <div class="mb-10 text-center">
              <h2 class="mb-4 text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <LuCamera class="h-8 w-8 text-green-600" />
                Galería de Arte
              </h2>
              <div class="mx-auto h-1 w-20 rounded bg-green-600"></div>
            </div>
            
            <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryUrls.map((url, i) => (
                <div key={i} class="break-inside-avoid overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <img
                    src={url}
                    alt={`Galería de Arte ${i + 1}`}
                    loading="lazy"
                    class="h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
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
