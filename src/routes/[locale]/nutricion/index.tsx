import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionConfig, nutricionHorarios } from "~/db/schema.server";
import { LuClock, LuInstagram } from "@qwikest/icons/lucide";
import { PageHero } from "~/components/ui/PageHero";

export const useNutricionData = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const [config] = await db.select().from(nutricionConfig).limit(1);
  const horarios = await db.select().from(nutricionHorarios);
  
  return {
    config: config || { 
      nombre: "Profesional de Nutrición", 
      descripcion: "<p>Información no disponible.</p>",
      heroTitle: "Gabinete de Nutrición",
      heroDescription: "Atención profesional al servicio de tu bienestar y rendimiento físico. Conseguí tus objetivos con asesoramiento personalizado.",
      heroImageUrl: null
    },
    horarios
  };
});

export default component$(() => {
  const data = useNutricionData();
  const { config, horarios } = data.value;

  const groupedHorarios: Record<string, string[]> = {};
  horarios.forEach(h => {
    if (!groupedHorarios[h.dia_semana]) {
      groupedHorarios[h.dia_semana] = [];
    }
    groupedHorarios[h.dia_semana].push(`${h.hora_inicio} a ${h.hora_fin}hs`);
  });

  return (
    <div class="flex min-h-screen flex-col bg-green-50/30">
      <PageHero
        title={config.heroTitle || "Gabinete de Nutrición"}
        description={config.heroDescription || "Atención profesional al servicio de tu bienestar y rendimiento físico. Conseguí tus objetivos con asesoramiento personalizado."}
      />

      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="mb-14 text-center">
             {config.heroImageUrl && (
               <div class="mb-6 flex justify-center">
                 <div class="h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-green-100 bg-white">
                   <img src={config.heroImageUrl} alt={config.nombre} class="h-full w-full object-cover" />
                 </div>
               </div>
             )}
             <h2 class="text-3xl font-bold text-gray-800">{config.nombre}</h2>
             <div class="mx-auto mt-4 h-1 w-20 rounded-full bg-green-500"></div>
          </div>

          <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-md border border-green-100">
             <div class="grid md:grid-cols-2">
                {/* Info Description */}
                <div class="p-10 border-b md:border-b-0 md:border-r border-gray-100 bg-white">
                   <h3 class="text-xl font-bold text-green-900 mb-6">Acerca de la atención</h3>
                    <div class="prose prose-sm prose-green max-w-none text-gray-600 mb-8" dangerouslySetInnerHTML={config.descripcion} />
                    
                    <div class="pt-6 border-t border-gray-100">
                      <a 
                        href="https://www.instagram.com/punto.nutricion.miramar/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-bold transition-colors group"
                      >
                        <LuInstagram class="h-6 w-6 transition-transform group-hover:scale-110" />
                        <span class="border-b border-transparent group-hover:border-green-700">@punto.nutricion.miramar</span>
                      </a>
                    </div>
                </div>
                
                {/* Horarios */}
                <div class="p-10 bg-green-50/50">
                   <h3 class="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                      <LuClock class="h-6 w-6 text-green-600" />
                      Horarios Disponibles
                   </h3>
                   
                   {horarios.length === 0 ? (
                     <p class="text-gray-500 italic">No hay horarios cargados actualmente.</p>
                   ) : (
                     <div class="space-y-4">
                       {Object.entries(groupedHorarios).map(([dia, slots]) => (
                         <div key={dia} class="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                           <h4 class="font-bold text-gray-800 mb-2">{dia}</h4>
                           <div class="flex flex-wrap gap-2">
                             {slots.map((slot, i) => (
                                <span key={i} class="inline-block bg-green-50 text-green-800 border border-green-200 px-3 py-1 text-sm font-semibold rounded-lg">
                                   {slot}
                                </span>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Nutrición - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Gabinete de Nutrición en el Círculo Italiano de Miramar. Evaluaciones y planes de alimentación.",
    },
  ],
};
