import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { danzasCronograma, danzasGaleria, danzasConfig } from "~/db/schema.server";
import { desc } from "drizzle-orm";
import { LuMusic, LuDownload } from "@qwikest/icons/lucide";

export const useDanzasData = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const schedule = await db.select().from(danzasCronograma).orderBy(desc(danzasCronograma.hora_inicio));
  const gallery = await db.select().from(danzasGaleria).orderBy(desc(danzasGaleria.createdAt));
  const configRaw = await db.select().from(danzasConfig).limit(1);
  const currentPdfUrl = configRaw.length > 0 ? configRaw[0].pdf_url : null;
  
  return { schedule, gallery, currentPdfUrl };
});

export default component$(() => {
  const data = useDanzasData();
  const schedule = data.value.schedule;
  const currentPdfUrl = data.value.currentPdfUrl;

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves"];

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <section class="bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 py-20 text-white">
        <div class="container mx-auto px-4 text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <LuMusic class="h-10 w-10 text-indigo-200" />
          </div>
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">Ritmos en Acción</h1>
          <p class="mx-auto max-w-2xl text-xl text-indigo-200">
            Escuela de danzas del Círculo Italiano. Descubrí tu pasión por el baile con nuestros excelentes profesores.
          </p>
        </div>
      </section>

      {/* Schedule Grid */}
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="mb-4 text-center">
            <h2 class="text-3xl font-bold text-gray-900">Grilla de Horarios</h2>
            <div class="mx-auto mt-4 h-1 w-20 rounded-full bg-indigo-600"></div>
          </div>
          
          <div class="mb-12 text-center">
            {currentPdfUrl ? (
               <a 
                 href={currentPdfUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
               >
                 <LuDownload class="mr-2 h-5 w-5" /> Descargar Cronograma (PDF)
               </a>
            ) : (
               <p class="text-sm text-gray-500">Cronograma en PDF no disponible momentáneamente.</p>
            )}
          </div>

          {schedule.length === 0 ? (
            <div class="text-center text-gray-500 py-10">
              <p>El cronograma de clases aún no está disponible.</p>
            </div>
          ) : (
            <div class="mx-auto max-w-7xl">
              {/* Grid de Días (Único) */}
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-0 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                {dias.map((dia, idx) => {
                  // Filter and sort classes for this specific day across ALL salons
                  const clases = schedule
                    .filter((c) => c.dia_semana.toLowerCase() === dia.toLowerCase())
                    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

                  return (
                    <div 
                      key={dia} 
                      class={["flex flex-col p-4", idx < dias.length - 1 ? "lg:border-r border-gray-100" : "", "border-b lg:border-b-0 border-gray-100"].join(" ")}
                    >
                      <div class="text-center mb-6">
                        <h4 class="inline-block text-sm font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                          {dia}
                        </h4>
                      </div>

                      {clases.length === 0 ? (
                        <div class="flex-1 flex flex-col items-center justify-center text-gray-300 py-4 text-sm font-medium">
                          - Sin clases -
                        </div>
                      ) : (
                        <div class="space-y-4 flex-1">
                          {clases.map((c) => (
                            <div key={c.id} class={`group bg-white border shadow-sm hover:shadow-md rounded-xl p-4 flex flex-col transition-all duration-300 relative overflow-hidden ${c.salon === 1 ? 'border-indigo-100 hover:border-indigo-300' : 'border-purple-100 hover:border-purple-300'}`}>
                              {/* Pestaña de color decorativa según salón */}
                              <div class={`absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity ${c.salon === 1 ? 'bg-indigo-400' : 'bg-purple-400'}`}></div>
                              
                              <div class="pl-2">
                                <div class="flex flex-wrap gap-2 mb-2">
                                  <div class="inline-block font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {c.hora_inicio} a {c.hora_fin}
                                  </div>
                                  <div class={`inline-block font-mono text-xs font-bold text-white px-2 py-1 rounded ${c.salon === 1 ? 'bg-indigo-600' : 'bg-purple-600'}`}>
                                    Salón {c.salon}
                                  </div>
                                </div>
                                <h5 class="font-extrabold text-gray-900 text-base leading-tight mb-1">{c.categoria}</h5>
                                <p class="text-indigo-600 font-semibold text-sm mb-3">{c.clase}</p>
                                
                                <div class="pt-3 border-t border-gray-50 flex items-center text-xs text-gray-500 font-medium">
                                  <span class="truncate">Prof: {c.profesores}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {data.value.gallery.length > 0 && (
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mb-10 text-center">
              <h2 class="text-3xl font-bold text-gray-900">Galería</h2>
              <div class="mx-auto mt-4 h-1 w-16 rounded-full bg-indigo-600"></div>
            </div>

            <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.value.gallery.map((image) => (
                <div key={image.id} class="group overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                  <div class="relative pb-[100%]">
                    <img
                      src={image.imageUrl}
                      alt="Danza galería"
                      loading="lazy"
                      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Danzas - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Escuela de danzas del Círculo Italiano. Conocé nuestros profesores y horarios actualizados.",
    },
  ],
};
