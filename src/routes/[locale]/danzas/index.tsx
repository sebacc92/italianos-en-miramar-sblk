import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { danzasCronograma, danzasGaleria, danzasConfig } from "~/db/schema.server";
import { desc } from "drizzle-orm";
import { _ } from "compiled-i18n";
import { LuMusic, LuDownload, LuInstagram, LuPhone, LuMapPin } from "@qwikest/icons/lucide";
import { PageHero } from "~/components/ui/PageHero";

export const useDanzasData = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const schedule = await db.select().from(danzasCronograma).orderBy(desc(danzasCronograma.hora_inicio));
  const galleryRaw = await db.select().from(danzasGaleria).orderBy(desc(danzasGaleria.createdAt));
  const gallery = galleryRaw.map(({ createdAt, ...rest }) => rest);
  
  const configRaw = await db.select().from(danzasConfig).limit(1);
  const config = configRaw.length > 0 ? configRaw[0] : null;
  
  return { schedule, gallery, config };
});

export default component$(() => {
  const data = useDanzasData();
  const schedule = data.value.schedule;
  const config = data.value.config;
  const currentPdfUrl = config?.pdf_url;

  const selectedCategory = useSignal("Todas");
  const selectedTeacher = useSignal("Todos");
  
  // Extract unique categories and group them alphabetically
  const uniqueCategories = Array.from(new Set(schedule.map(c => c.categoria))).sort();
  const sortedCategories = ["Todas", ...uniqueCategories];

  // Extract unique teachers, handling multiple teachers per class (separated by comma or "y")
  // Special rules: Exclude Dai, Ro. Combine Diego & Nico.
  const uniqueTeachers = Array.from(new Set(
    schedule.flatMap(c => {
      const raw = c.profesores;
      const lowered = raw.toLowerCase();
      
      // Determine if this class has both Diego and Nico
      const isDiegoAndNico = 
        lowered.includes("diego y nico") || 
        lowered.includes("nico y diego") ||
        (lowered.includes("diego") && lowered.includes("nico"));
      
      // Standardize and split to get individual names, then filter out the special ones
      const individualNames = raw
        .replace(/\s+y\s+/g, ', ')
        .split(',')
        .map(p => p.trim())
        .filter(p => p && !["Dai", "Ro", "Diego", "Nico"].includes(p));
      
      if (isDiegoAndNico) {
        individualNames.push("Diego y Nico");
      }
      
      return individualNames;
    })
  )).sort();
  const sortedTeachers = ["Todos", ...uniqueTeachers];

  const filteredSchedule = schedule.filter(c => {
    const matchesCategory = selectedCategory.value === "Todas" || c.categoria === selectedCategory.value;
    
    const raw = c.profesores;
    const lowered = raw.toLowerCase();
    
    if (selectedTeacher.value === "Todos") return matchesCategory;
    
    // Custom logic for "Diego y Nico" filter
    if (selectedTeacher.value === "Diego y Nico") {
      const match = lowered.includes("diego y nico") || 
                    lowered.includes("nico y diego") ||
                    (lowered.includes("diego") && lowered.includes("nico"));
      return matchesCategory && match;
    }

    // Standard logic for other teachers
    const classTeachers = raw
      .replace(/\s+y\s+/g, ', ')
      .split(',')
      .map(p => p.trim());
    
    return matchesCategory && classTeachers.includes(selectedTeacher.value);
  });

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves"];

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <PageHero
        title={
          <div class="flex flex-col items-center justify-center">
            <img 
              src="/logo-ritmos-en-accion.webp" 
              alt="Ritmos en Acción" 
              class="h-32 md:h-48 mb-6 object-contain drop-shadow-2xl" 
            />
            <span>{config?.heroTitle || "Ritmos en Acción"}</span>
          </div>
        }
        description={config?.heroDescription || _`dance.hero.pageDescription`}
      />

      {/* Schedule Grid */}
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="mb-4 text-center">
            <h2 class="text-3xl font-bold text-gray-900">Grilla de Horarios</h2>
            <div class="mx-auto mt-4 h-1 w-20 rounded-full bg-indigo-600"></div>
          </div>
          
          {schedule.length > 0 && (
            <div class="mb-12 space-y-6">
              {/* Categorías */}
              <div class="flex flex-col items-center">
                <span class="text-xs font-bold uppercase tracking-widest text-[#7F2A7A]/60 mb-3">Filtrar por Categoría</span>
                <div class="flex flex-wrap items-center justify-center gap-2 max-w-6xl mx-auto">
                  {sortedCategories.map(cat => (
                    <button
                      key={cat}
                      onClick$={() => selectedCategory.value = cat}
                      class={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 outline-none ${
                        selectedCategory.value === cat 
                          ? "bg-[#7F2A7A] text-white shadow-md scale-105" 
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profesores */}
              <div class="flex flex-col items-center">
                <span class="text-xs font-bold uppercase tracking-widest text-indigo-900/40 mb-3">Filtrar por Profesor</span>
                <div class="flex flex-wrap items-center justify-center gap-2 max-w-6xl mx-auto">
                  {sortedTeachers.map(prof => (
                    <button
                      key={prof}
                      onClick$={() => selectedTeacher.value = prof}
                      class={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 outline-none ${
                        selectedTeacher.value === prof 
                          ? "bg-indigo-600 text-white shadow-md scale-105" 
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedCategory.value !== "Todas" || selectedTeacher.value !== "Todos") && (
                <div class="flex justify-center pt-2">
                  <button 
                    onClick$={() => {
                      selectedCategory.value = "Todas";
                      selectedTeacher.value = "Todos";
                    }}
                    class="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {schedule.length === 0 ? (
            <div class="text-center text-gray-500 py-10">
              <p>El cronograma de clases aún no está disponible.</p>
            </div>
          ) : (
            <div class="mx-auto max-w-7xl">
              {/* Grid de Días (Único) */}
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {dias.map((dia, idx) => {
                  // Filter and sort classes for this specific day and active category across ALL salons
                  const clases = filteredSchedule
                    .filter((c) => c.dia_semana.toLowerCase() === dia.toLowerCase())
                    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

                  return (
                    <div 
                      key={dia} 
                      class="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div class="bg-gray-50 border-b border-gray-100 text-center py-4">
                        <h4 class="inline-block text-sm font-bold uppercase tracking-widest text-[#7F2A7A]">
                          {dia}
                        </h4>
                      </div>

                      {clases.length === 0 ? (
                        <div class="flex-1 flex flex-col items-center justify-center text-gray-300 py-8 text-sm font-medium">
                          - Sin clases -
                        </div>
                      ) : (
                        <div class="space-y-4 flex-1 p-4">
                          {clases.map((c) => (
                            <div key={c.id} class={`group bg-white border shadow-sm hover:shadow-md rounded-xl p-5 flex flex-col transition-all duration-300 relative overflow-hidden ${c.salon === 1 ? 'border-indigo-100 hover:border-indigo-300' : 'border-purple-100 hover:border-purple-300'}`}>
                              {/* Pestaña de color decorativa según salón */}
                              <div class={`absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity ${c.salon === 1 ? 'bg-indigo-400' : 'bg-purple-400'}`}></div>
                              
                              <div class="pl-2">
                                <div class="flex flex-wrap gap-2 mb-3">
                                  <div class="inline-block font-mono text-base font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    {c.hora_inicio} a {c.hora_fin}
                                  </div>
                                  <div class={`inline-block text-xs font-bold px-2 py-1 rounded-full ${c.salon === 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                                    Salón {c.salon}
                                  </div>
                                </div>
                                <h5 class="font-extrabold text-gray-900 text-lg leading-tight mb-2">{c.categoria}</h5>
                                <p class="text-indigo-600 font-semibold text-base mb-4">{c.clase}</p>
                                
                                <div class="pt-3 border-t border-gray-50 flex items-center text-sm text-gray-600 font-medium">
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

              {/* Download Option Moved Here */}
              <div class="mt-12 text-center w-full max-w-sm mx-auto">
                {currentPdfUrl ? (
                   <a 
                     href={currentPdfUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="flex items-center justify-center bg-[#7F2A7A] hover:bg-[#662061] text-white py-3 px-8 text-lg font-bold rounded-xl shadow-lg transition-all w-full active:scale-95"
                   >
                     <LuDownload class="mr-2 h-6 w-6" /> Descargar Cronograma
                   </a>
                ) : (
                   <p class="text-base text-gray-500 font-medium bg-gray-100 py-3 px-6 rounded-xl border border-gray-200">
                     Cronograma en PDF no disponible momentáneamente.
                   </p>
                )}
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

      {/* Contacto Danzas */}
      <section class="bg-[#7F2A7A] py-16 text-white text-center md:text-left">
        <div class="container mx-auto px-4 max-w-5xl">
          <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
            
            {/* Logo */}
            <div class="w-32 h-32 bg-white/10 rounded-2xl border border-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner overflow-hidden p-2">
               <img src="/logo-ritmos-en-accion.webp" alt="Ritmos en Acción" class="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div class="flex flex-col space-y-4 flex-1">
              <h3 class="text-3xl font-black tracking-tight text-white mb-2 leading-tight">
                RITMOS EN ACCIÓN <br/>
                <span class="text-xl font-medium text-white/80 tracking-wide block mt-1">ESCUELA DE DANZAS</span>
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
                 <a href="https://instagram.com/ritmos.en.accion" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 hover:text-white transition-colors">
                   <LuInstagram class="h-5 w-5 opacity-70" />
                   <span class="font-bold tracking-wide">@ritmos.en.accion</span>
                 </a>
                 <a href="tel:2235380187" class="flex items-center gap-3 hover:text-white transition-colors">
                   <LuPhone class="h-5 w-5 opacity-70" />
                   <span class="font-bold tracking-wide">223 538-0187</span>
                 </a>
                 <div class="flex items-center gap-3 sm:col-span-2">
                   <LuMapPin class="h-5 w-5 opacity-70 shrink-0" />
                   <span class="font-medium">Calle 24 nº 1214 (Círculo Italiano - Miramar)</span>
                 </div>
              </div>
            </div>
            
            {/* Optional decorative button to whatsapp specifically */}
            <div class="mt-4 md:mt-0 md:ml-auto">
               <a href="https://wa.me/5492235380187?text=Hola,%20vengo%20del%20sitio%20web%20del%20C%C3%ADrculo%20Italiano%20y%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20escuela%20de%20danzas." target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-[#7F2A7A] transition-transform hover:scale-105 active:scale-95 shadow-lg">
                 Envianos un WhatsApp
               </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: _`dance.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`dance.meta.pageContent`,
    },
    {
      property: "og:title",
      content: _`dance.metaTitle`,
    },
    {
      property: "og:description",
      content: _`dance.meta.pageContent`,
    },
    {
      property: "og:image",
      content: "/logo-ritmos-en-accion.webp",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
  links: [
    {
      rel: "icon",
      href: "/logo-ritmos-en-accion.webp",
    },
    {
      rel: "shortcut icon",
      href: "/logo-ritmos-en-accion.webp",
    },
  ],
};
