import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { exposiciones, exposicionesObras } from "~/db/schema.server";
import { desc, eq } from "drizzle-orm";
import { LuPalette, LuCalendar, LuUser, LuPhone } from "@qwikest/icons/lucide";

export const useAllExposiciones = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  
  // We fetch the most recent one as primary
  const todas = await db.select().from(exposiciones).orderBy(desc(exposiciones.createdAt));
  
  if (todas.length === 0) return { activeExpo: null, activeObras: [] };
  
  const activeExpoRaw = todas[0];
  const { createdAt: _e, ...activeExpo } = activeExpoRaw;

  const obrasRaw = await db.select().from(exposicionesObras).where(eq(exposicionesObras.exposicion_id, activeExpo.id));
  const activeObras = obrasRaw.map(({ createdAt, ...rest }) => rest);
  
  return { activeExpo, activeObras };
});

export default component$(() => {
  const data = useAllExposiciones();
  const { activeExpo, activeObras } = data.value;

  return (
    <div class="flex min-h-screen flex-col bg-[#faf9f6]">
      {/* Hero */}
      <section class="bg-linear-to-br from-stone-900 via-stone-800 to-stone-900 py-24 text-white shadow-xl relative overflow-hidden">
        {/* Artistic ambient overlay */}
        <div class="absolute inset-0 bg-stone-900/50 mix-blend-multiply"></div>
        <div class="container relative z-10 mx-auto px-4 text-center">
          <div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <LuPalette class="h-12 w-12 text-stone-200" />
          </div>
          <h1 class="mb-5 text-5xl font-black md:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-400">Sala de Exposiciones</h1>
          <p class="mx-auto max-w-2xl text-xl text-stone-300 leading-relaxed font-light mt-6">
            Espacio cultural del Círculo Italiano destinado a celebrar el arte regional contemporáneo y tradicional.
          </p>
        </div>
      </section>

      {/* Main Exhibition Content */}
      <section class="py-20">
        <div class="container mx-auto px-4 max-w-7xl">
          {!activeExpo ? (
            <div class="text-center text-gray-500 py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <LuPalette class="mx-auto h-16 w-16 text-stone-200 mb-4" />
              <p class="text-xl">En este momento estamos montando la próxima exposición.</p>
              <p class="mt-2 text-stone-400">¡Vuelve pronto!</p>
            </div>
          ) : (
            <div class="space-y-16">
              
              {/* Exhibition Meta Info */}
              <div class="bg-white rounded-3xl p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div>
                    <span class="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 font-bold text-xs tracking-widest uppercase mb-4">
                      Exhibición Actual
                    </span>
                    <h2 class="text-4xl font-black text-stone-900 mb-6">{activeExpo.titulo}</h2>
                    
                    <div class="flex flex-wrap gap-6 text-stone-600 font-medium">
                      <div class="flex items-center">
                        <LuUser class="mr-2 h-5 w-5 text-stone-400" />
                        Obra de: <span class="ml-1 text-stone-900 font-bold">{activeExpo.nombre_artista}</span>
                      </div>
                      <div class="flex items-center">
                        <LuCalendar class="mr-2 h-5 w-5 text-stone-400" />
                        Inauguración: <span class="ml-1 text-stone-900">{activeExpo.fecha_inauguracion}</span>
                      </div>
                      <div class="flex items-center">
                        <LuPhone class="mr-2 h-5 w-5 text-stone-400" />
                        Contacto: <span class="ml-1 text-stone-900">{activeExpo.contacto_artista}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Grid (Masonry approach using columns) */}
              {activeObras.length > 0 ? (
                 <div>
                    <h3 class="text-2xl font-bold text-stone-900 mb-8 border-b border-stone-200 pb-4">Obras</h3>
                    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {activeObras.map((obra) => (
                        <div key={obra.id} class="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500">
                          <img 
                            src={obra.image_url} 
                            alt={obra.titulo_obra || 'Obra de exposición'} 
                            loading="lazy" 
                            class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                          />
                          
                          {/* Overlay with details */}
                          <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            {(obra.titulo_obra || obra.descripcion_obra) ? (
                              <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {obra.titulo_obra && <h4 class="text-white font-bold text-xl mb-1">{obra.titulo_obra}</h4>}
                                {obra.descripcion_obra && <p class="text-stone-300 text-sm font-medium leading-snug">{obra.descripcion_obra}</p>}
                              </div>
                            ) : (
                              <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h4 class="text-white font-bold text-xl mb-1">Sin título</h4>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              ) : (
                 <div class="text-center py-16">
                    <p class="text-stone-500 text-lg">Las obras de esta exposición serán publicadas pronto.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sala de Exposiciones - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Visita nuestra sala de exposiciones de arte de artistas locales y regionales en Miramar.",
    },
  ],
};
