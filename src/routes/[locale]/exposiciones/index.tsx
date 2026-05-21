import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { exposiciones, exposicionesObras } from "~/db/schema.server";
import { desc, eq } from "drizzle-orm";
import {
  LuPalette,
  LuCalendar,
  LuUser,
  LuPhone,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuInfo,
  LuSparkles
} from "@qwikest/icons/lucide";
import salaExposicionesUrl from "~/media/sala-de-exposiciones.webp?url";

export const useAllExposiciones = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);

  const todasRaw = await db.select().from(exposiciones).orderBy(desc(exposiciones.fecha_inicio));
  const todas = todasRaw.map(({ createdAt, ...rest }) => rest);

  if (todas.length === 0) return { exposiciones: [], activeExpoId: null };

  const allObrasRaw = await db.select().from(exposicionesObras).orderBy(desc(exposicionesObras.createdAt));
  const todasObras = allObrasRaw.map(({ createdAt, ...rest }) => rest);

  // Group works by exposicion_id
  const exposicionesWithObras = todas.map(expo => {
    return {
      ...expo,
      obras: todasObras.filter(obra => obra.exposicion_id === expo.id)
    };
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Find active exhibition based on date range
  let activeExpo = todas.find(
    expo =>
      expo.fecha_inicio &&
      expo.fecha_fin &&
      expo.fecha_inicio <= todayStr &&
      expo.fecha_fin >= todayStr
  );

  // Fallback to the first (most recent) one if none is currently active
  if (!activeExpo) {
    activeExpo = todas[0];
  }

  return {
    exposiciones: exposicionesWithObras,
    activeExpoId: activeExpo ? activeExpo.id : null
  };
});

export default component$(() => {
  const data = useAllExposiciones();
  const { exposiciones: list, activeExpoId } = data.value;

  const selectedExpoId = useSignal<string | null>(activeExpoId);
  const lightboxIndex = useSignal<number | null>(null);

  // Selected exhibition data
  const selectedExpo = useComputed$(() => {
    if (!selectedExpoId.value) return null;
    return list.find(e => e.id === selectedExpoId.value) || null;
  });

  // Current date in YYYY-MM-DD to calculate badges dynamically
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to parse contact info
  const parseContacto = (contacto: string) => {
    const trimmed = contacto.trim();
    if (!trimmed) return null;

    // 1. Email check
    if (trimmed.includes("@") && !trimmed.includes("instagram.com") && !trimmed.startsWith("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) {
        return {
          url: `mailto:${trimmed}`,
          label: trimmed,
          type: "email"
        };
      }
    }

    // 2. Instagram check
    if (trimmed.startsWith("@")) {
      const handle = trimmed.slice(1);
      return {
        url: `https://instagram.com/${handle}`,
        label: trimmed,
        type: "instagram"
      };
    }
    if (trimmed.toLowerCase().includes("instagram.com")) {
      let url = trimmed;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      let label = "@" + trimmed.split("instagram.com/")[1]?.replace(/\/$/, "") || trimmed;
      if (label === "@undefined" || label === "@") {
        label = "Instagram Artista";
      }
      return {
        url,
        label,
        type: "instagram"
      };
    }

    // 3. Phone number check (WhatsApp)
    const phoneDigits = trimmed.replace(/\D/g, "");
    if (phoneDigits.length >= 7) {
      return {
        url: `https://wa.me/${phoneDigits}`,
        label: trimmed,
        type: "phone"
      };
    }

    // 4. Fallback URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("www.")) {
      let url = trimmed;
      if (trimmed.startsWith("www.")) {
        url = "https://" + trimmed;
      }
      return {
        url,
        label: trimmed,
        type: "website"
      };
    }

    // 5. Default string fallback
    return {
      url: null,
      label: trimmed,
      type: "text"
    };
  };

  // Helper to get status badge
  const getStatusInfo = (inicio: string, fin: string) => {
    if (!inicio || !fin) return { label: "Sin fecha", color: "bg-gray-100 text-gray-700 border-gray-200" };
    if (inicio > todayStr) {
      return { label: "Proximamente", color: "bg-amber-50 text-amber-700 border-amber-200" };
    }
    if (inicio <= todayStr && fin >= todayStr) {
      return { label: "En curso", color: "bg-emerald-50 text-emerald-700 border-emerald-200 border-2 font-black animate-pulse" };
    }
    return { label: "Finalizada", color: "bg-stone-100 text-stone-600 border-stone-200" };
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = $((ev: KeyboardEvent) => {
    if (lightboxIndex.value === null || !selectedExpo.value) return;
    const maxIndex = selectedExpo.value.obras.length - 1;

    if (ev.key === "Escape") {
      lightboxIndex.value = null;
    } else if (ev.key === "ArrowRight") {
      lightboxIndex.value = lightboxIndex.value < maxIndex ? lightboxIndex.value + 1 : 0;
    } else if (ev.key === "ArrowLeft") {
      lightboxIndex.value = lightboxIndex.value > 0 ? lightboxIndex.value - 1 : maxIndex;
    }
  });

  return (
    <div class="flex min-h-screen flex-col bg-[#FAF9F6]" window:onKeyDown$={handleKeyDown}>
      {/* Hero Section */}
      <section class="py-24 text-white shadow-xl relative overflow-hidden">
        <img
          src={salaExposicionesUrl}
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover"
          width="1920"
          height="600"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black/70"></div>
        <div class="container relative z-10 mx-auto px-4 text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <LuPalette class="h-10 w-10 text-stone-200" />
          </div>
          <h1 class="mb-5 text-5xl font-black md:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-400">Sala de Exposiciones</h1>
          <p class="mx-auto max-w-2xl text-lg text-stone-300 leading-relaxed font-light mt-4">
            Recorre nuestra galería de muestras artísticas. Explora la colección actual y revive las exposiciones históricas de nuestra comunidad.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section class="py-12">
        <div class="container mx-auto px-4 max-w-7xl">
          {list.length === 0 ? (
            <div class="text-center text-gray-500 py-20 bg-white rounded-3xl border border-stone-200 shadow-sm">
              <LuPalette class="mx-auto h-16 w-16 text-stone-200 mb-4" />
              <p class="text-xl">En este momento estamos montando la próxima exposición.</p>
              <p class="mt-2 text-stone-400">¡Vuelve pronto!</p>
            </div>
          ) : (
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">

              {/* Sidebar: Chronological Exhibitions List */}
              <div class="lg:col-span-4 space-y-6">
                <div class="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
                  <h2 class="text-lg font-black text-stone-900 flex items-center gap-2">
                    <LuSparkles class="h-5 w-5 text-amber-500" />
                    Historial de Muestras
                  </h2>
                  <p class="text-xs text-stone-400 mt-1">Selecciona una exposición para ver sus detalles y obras.</p>
                </div>

                <div class="space-y-4 max-h-[70vh] lg:max-h-[85vh] overflow-y-auto pr-2 scrollbar-thin">
                  {list.map((expo) => {
                    const status = getStatusInfo(expo.fecha_inicio, expo.fecha_fin);
                    const isSelected = selectedExpoId.value === expo.id;
                    const isActive = activeExpoId === expo.id;

                    return (
                      <button
                        key={expo.id}
                        onClick$={() => {
                          selectedExpoId.value = expo.id;
                          lightboxIndex.value = null; // Reset lightbox
                        }}
                        class={[
                          "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 focus:outline-none shadow-sm",
                          isSelected
                            ? "bg-stone-900 border-stone-950 text-white translate-x-1 ring-4 ring-stone-900/10"
                            : "bg-white hover:bg-stone-50 border-stone-200/80 hover:border-stone-300 text-stone-850"
                        ]}
                      >
                        {/* Thumbnail / Flyer small */}
                        <div class="relative shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/80 flex items-center justify-center">
                          {expo.flyerUrl ? (
                            <img
                              src={expo.flyerUrl}
                              alt={expo.titulo}
                              class="w-full h-full object-cover"
                              width="64"
                              height="80"
                              loading="lazy"
                            />
                          ) : (
                            <LuPalette class="h-6 w-6 text-stone-400" />
                          )}
                        </div>

                        {/* Title & metadata info */}
                        <div class="min-w-0 flex-1 flex flex-col justify-between h-20">
                          <div>
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class={[
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase",
                                isSelected && isActive
                                  ? "bg-emerald-600 text-white border-emerald-700 font-extrabold animate-pulse"
                                  : status.color
                              ]}>
                                {isActive && !isSelected ? "🔴 Activa" : status.label}
                              </span>
                            </div>
                            <h3 class={[
                              "font-black text-sm mt-1.5 leading-tight truncate",
                              isSelected ? "text-white" : "text-stone-900"
                            ]}>
                              {expo.titulo}
                            </h3>
                            <p class={[
                              "text-xs mt-0.5 truncate",
                              isSelected ? "text-stone-300" : "text-stone-500"
                            ]}>
                              Artista: <span class="font-semibold">{expo.nombre_artista}</span>
                            </p>
                          </div>

                          <div class={[
                            "text-[10px] font-medium flex items-center gap-1 mt-1",
                            isSelected ? "text-stone-400" : "text-stone-400"
                          ]}>
                            <LuCalendar class="h-3 w-3 shrink-0" />
                            {expo.fecha_inicio ? `${expo.fecha_inicio} al ${expo.fecha_fin}` : expo.fecha_inauguracion}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Panel: Selected Exhibition Info & Artwork Grid */}
              <div class="lg:col-span-8 space-y-8">
                {selectedExpo.value ? (
                  <div class="space-y-8 animate-in fade-in duration-500">

                    {/* Header Card / Presentation */}
                    <div class="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
                      <div class="flex flex-col md:flex-row">

                        {/* Flyer side */}
                        {selectedExpo.value.flyerUrl && (
                          <div class="relative shrink-0 md:w-72 lg:w-80 h-80 md:h-auto min-h-[320px] overflow-hidden bg-stone-50 border-b md:border-b-0 md:border-r border-stone-100">
                            <img
                              src={selectedExpo.value.flyerUrl}
                              alt={`Flyer de la exposición: ${selectedExpo.value.titulo}`}
                              class="w-full h-full object-cover"
                              loading="eager"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent"></div>
                          </div>
                        )}

                        {/* Details side */}
                        <div class="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                          <div class="flex items-center gap-2 mb-4">
                            <span class={[
                              "px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase",
                              selectedExpo.value.id === activeExpoId
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold animate-pulse"
                                : getStatusInfo(selectedExpo.value.fecha_inicio, selectedExpo.value.fecha_fin).color
                            ]}>
                              {selectedExpo.value.id === activeExpoId ? "🔴 Exposición Activa" : getStatusInfo(selectedExpo.value.fecha_inicio, selectedExpo.value.fecha_fin).label}
                            </span>
                          </div>

                          <h2 class="text-3xl font-black text-stone-900 leading-tight mb-6">
                            {selectedExpo.value.titulo}
                          </h2>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-stone-600 font-medium border-t border-stone-100 pt-6">
                            <div class="flex items-center gap-3">
                              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
                                <LuUser class="h-4.5 w-4.5 text-stone-500" />
                              </div>
                              <div>
                                <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Artista</p>
                                <p class="text-stone-900 font-black">{selectedExpo.value.nombre_artista}</p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
                                <LuCalendar class="h-4.5 w-4.5 text-stone-500" />
                              </div>
                              <div>
                                <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Inauguración</p>
                                <p class="text-stone-900 font-semibold">{selectedExpo.value.fecha_inauguracion}</p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
                                <LuCalendar class="h-4.5 w-4.5 text-stone-500" />
                              </div>
                              <div>
                                <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Vigencia</p>
                                <p class="text-stone-900 font-semibold">
                                  {selectedExpo.value.fecha_inicio ? `${selectedExpo.value.fecha_inicio} al ${selectedExpo.value.fecha_fin}` : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div class="flex items-center gap-3">
                              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
                                <LuPhone class="h-4.5 w-4.5 text-stone-500" />
                              </div>
                              <div>
                                <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Contacto Artista</p>
                                {(() => {
                                  const contactoParsed = parseContacto(selectedExpo.value.contacto_artista);
                                  if (!contactoParsed) {
                                    return <p class="text-stone-400 font-semibold">Sin contacto</p>;
                                  }
                                  if (contactoParsed.url) {
                                    return (
                                      <a
                                        href={contactoParsed.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-indigo-600 hover:text-indigo-850 font-black hover:underline flex items-center gap-1 transition-all text-xs truncate max-w-[220px]"
                                        title={contactoParsed.label}
                                      >
                                        {contactoParsed.label}
                                        <span class="text-[9px] font-normal text-stone-400 uppercase tracking-tight shrink-0">
                                          {contactoParsed.type === "instagram" && "IG"}
                                          {contactoParsed.type === "phone" && "WA"}
                                          {contactoParsed.type === "email" && "Mail"}
                                          {contactoParsed.type === "website" && "Web"}
                                        </span>
                                      </a>
                                    );
                                  }
                                  return (
                                    <p class="text-stone-950 font-semibold truncate max-w-[200px]" title={contactoParsed.label}>
                                      {contactoParsed.label}
                                    </p>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Gallery section */}
                    <div class="space-y-6">
                      <div class="flex items-center justify-between border-b border-stone-200 pb-3">
                        <h3 class="text-xl font-black text-stone-900 flex items-center gap-2">
                          Galería de Obras
                          <span class="text-sm font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                            {selectedExpo.value.obras.length}
                          </span>
                        </h3>
                        <p class="text-xs text-stone-400 italic">Haz clic en cualquier obra para ampliarla.</p>
                      </div>

                      {selectedExpo.value.obras.length > 0 ? (
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {selectedExpo.value.obras.map((obra, idx) => (
                            <button
                              key={obra.id}
                              onClick$={() => {
                                lightboxIndex.value = idx;
                              }}
                              class="text-left w-full group flex flex-col bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 focus:outline-none"
                            >
                              {/* Image Container */}
                              <div class="relative aspect-square w-full overflow-hidden bg-stone-50 border-b border-stone-100">
                                <img
                                  src={obra.image_url}
                                  alt={obra.titulo_obra || "Obra de arte"}
                                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div class="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-all duration-300 flex items-center justify-center">
                                  <span class="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                                    Ampliar Imagen
                                  </span>
                                </div>
                              </div>

                              {/* Title and details always visible under the image as requested */}
                              <div class="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 class="font-bold text-stone-900 text-sm leading-snug group-hover:text-stone-950 transition-colors">
                                    {obra.titulo_obra || "Sin título"}
                                  </h4>
                                  {obra.descripcion_obra && (
                                    <p class="text-xs text-stone-500 mt-1 line-clamp-3 leading-relaxed">
                                      {obra.descripcion_obra}
                                    </p>
                                  )}
                                </div>
                                <div class="mt-3 pt-3 border-t border-stone-100/80 flex items-center justify-between text-[10px] text-stone-400 font-semibold">
                                  <span>Círculo Italiano Galería</span>
                                  <LuSparkles class="h-3.5 w-3.5 text-stone-300" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div class="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                          <LuPalette class="mx-auto h-12 w-12 text-stone-300 mb-3" />
                          <p class="text-stone-500 font-semibold">Próximamente obras</p>
                          <p class="text-stone-400 text-xs mt-1">El artista está catalogando y subiendo las obras de esta muestra.</p>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div class="text-center py-20">
                    <p class="text-stone-500">Selecciona una exposición para ver sus detalles.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Premium full-screen Lightbox overlay */}
      {lightboxIndex.value !== null && selectedExpo.value && (
        <div class="fixed inset-0 z-50 flex flex-col justify-between bg-black/98 backdrop-blur-md animate-in fade-in duration-300">

          {/* Top Bar inside Lightbox */}
          <div class="flex items-center justify-between px-6 py-4 text-white bg-linear-to-b from-black/80 to-transparent">
            <div class="min-w-0">
              <span class="text-stone-400 text-[10px] uppercase font-bold tracking-widest">
                Muestra: {selectedExpo.value.titulo}
              </span>
              <h5 class="text-sm font-bold truncate">
                {selectedExpo.value.obras[lightboxIndex.value]?.titulo_obra || "Sin título"}
              </h5>
            </div>

            {/* Controls */}
            <div class="flex items-center gap-4">
              <span class="text-xs font-semibold text-stone-400">
                {lightboxIndex.value + 1} / {selectedExpo.value.obras.length}
              </span>
              <button
                onClick$={() => {
                  lightboxIndex.value = null;
                }}
                class="p-2 rounded-full hover:bg-white/10 text-stone-200 hover:text-white transition-colors"
                title="Cerrar (Esc)"
              >
                <LuX class="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main content with side controls */}
          <div class="flex-1 flex items-center justify-between px-4 md:px-8 relative">

            {/* Previous button */}
            <button
              onClick$={() => {
                if (lightboxIndex.value === null || !selectedExpo.value) return;
                const max = selectedExpo.value.obras.length - 1;
                lightboxIndex.value = lightboxIndex.value > 0 ? lightboxIndex.value - 1 : max;
              }}
              class="z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all shadow-md focus:outline-none"
              title="Anterior (Flecha izquierda)"
            >
              <LuChevronLeft class="h-7 w-7" />
            </button>

            {/* Central Zoomed Image */}
            <div class="flex-1 max-h-[75vh] max-w-[85vw] mx-auto flex items-center justify-center relative p-2">
              <img
                src={selectedExpo.value.obras[lightboxIndex.value]?.image_url}
                alt={selectedExpo.value.obras[lightboxIndex.value]?.titulo_obra || "Obra ampliada"}
                class="max-h-[75vh] max-w-[85vw] object-contain rounded-lg shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next button */}
            <button
              onClick$={() => {
                if (lightboxIndex.value === null || !selectedExpo.value) return;
                const max = selectedExpo.value.obras.length - 1;
                lightboxIndex.value = lightboxIndex.value < max ? lightboxIndex.value + 1 : 0;
              }}
              class="z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all shadow-md focus:outline-none"
              title="Siguiente (Flecha derecha)"
            >
              <LuChevronRight class="h-7 w-7" />
            </button>

          </div>

          {/* Bottom Bar inside Lightbox details */}
          <div class="px-6 py-6 text-white text-center bg-linear-to-t from-black/90 to-transparent flex flex-col items-center">
            {selectedExpo.value.obras[lightboxIndex.value]?.titulo_obra && (
              <h4 class="text-xl font-bold tracking-tight text-white mb-2">
                {selectedExpo.value.obras[lightboxIndex.value].titulo_obra}
              </h4>
            )}
            {selectedExpo.value.obras[lightboxIndex.value]?.descripcion_obra ? (
              <p class="max-w-2xl text-stone-300 text-sm leading-relaxed">
                {selectedExpo.value.obras[lightboxIndex.value].descripcion_obra}
              </p>
            ) : (
              <p class="text-stone-500 text-xs italic">Obra de la muestra personal de {selectedExpo.value.nombre_artista}</p>
            )}

            {/* Visual indicator for key controls */}
            <div class="mt-4 flex items-center gap-4 text-[10px] text-stone-500 font-semibold bg-stone-900/50 px-4 py-1.5 rounded-full border border-stone-800">
              <span class="flex items-center gap-1"><LuInfo class="h-3 w-3" /> Nivel de navegación:</span>
              <span>← / → para cambiar</span>
              <span>•</span>
              <span>ESC para cerrar</span>
            </div>
          </div>

        </div>
      )}
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
