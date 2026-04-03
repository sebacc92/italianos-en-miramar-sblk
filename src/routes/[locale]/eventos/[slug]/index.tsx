import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, Link, useLocation } from "@builder.io/qwik-city";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { getDb } from "~/db/client.server";
import { events, type Event } from "~/db/schema.server";
import { eq, and } from "drizzle-orm";

export const useEventoDetail = routeLoader$(async ({ params, env, fail }) => {
  const db = getDb(env);
  const locale = params.locale || "es";
  const id = Number(params.slug); // Using slug param as ID since DB uses numeric IDs

  if (!id || isNaN(id)) {
    return fail(404, { errorMessage: "Evento no encontrado" });
  }

  try {
    const [evento] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id), eq(events.language, locale as any)))
      .limit(1);

    if (!evento) {
      return fail(404, { errorMessage: "Evento no encontrado" });
    }

    return evento;
  } catch (error) {
    console.error("Error fetching event details from Drizzle:", error);
    return fail(500, { errorMessage: "Error cargando el evento" });
  }
});

export default component$(() => {
  const eventoSignal = useEventoDetail();
  const loc = useLocation();
  const currentLocale = loc.params.locale || "es";

  if (eventoSignal.value.errorMessage) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50 py-16 text-center">
        <div>
          <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">{eventoSignal.value.errorMessage}</h1>
          <Link href={`/${currentLocale}/eventos`} class="mt-6 inline-block text-green-600 hover:text-green-700 font-medium">
            ← Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  const content = eventoSignal.value as Event;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha por confirmar";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha por confirmar";
    try {
      const formattedDate = new Intl.DateTimeFormat(currentLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${formattedDate} - ${hours}:${minutes} hs`;
    } catch {
      return dateString;
    }
  };

  // Parse gallery safely
  let galleryUrls: string[] = [];
  if (content.gallery) {
    try {
      galleryUrls = typeof content.gallery === 'string' ? JSON.parse(content.gallery) : content.gallery;
    } catch {
      galleryUrls = [];
    }
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <Link href={`/${currentLocale}/eventos`} class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600">
          <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a Eventos
        </Link>
      </div>
      <article class="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {content.imageUrl && (
           <div class="mx-auto max-w-2xl mt-8 mb-4 px-6 md:px-0">
             <img
               src={content.imageUrl}
               alt={content.imageAlt || content.title}
               class="w-full max-h-[80vh] object-contain rounded-xl shadow-lg bg-zinc-50"
               width="1200"
               height="1200"
             />
           </div>
        )}

        <div class="p-8">
          <header class="mb-8 border-b border-gray-100 pb-8">
            <h1 class="mb-4 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
              {content.title}
            </h1>
            <div class="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 h-6 w-6 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span class="text-lg font-medium capitalize">
                {content.eventDate ? formatDate(content.eventDate) : "Fecha por confirmar"}
              </span>
            </div>
          </header>

          <div 
             class="prose prose-lg max-w-none text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-green-600 prose-img:rounded-xl"
             dangerouslySetInnerHTML={content.description || ""}
          />
          
          {/* Render Gallery */}
          {galleryUrls.length > 0 && (
             <div class="mt-12 pt-8 border-t border-gray-100">
               <h3 class="mb-6 text-2xl font-bold text-gray-900">Galería del Evento</h3>
               <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {galleryUrls.map((url, i) => (
                     <a href={url} target="_blank" rel="noopener noreferrer" key={i} class="group block overflow-hidden rounded-xl bg-gray-100 aspect-square">
                        <img 
                          src={url} 
                          alt={`Imagen ${i+1} de la galería`} 
                          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          loading="lazy"
                        />
                     </a>
                  ))}
               </div>
             </div>
          )}
        </div>
      </article>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const evento = resolveValue(useEventoDetail);

  if (evento.errorMessage) {
    return { title: 'No encontrado | Círculo Italiano' };
  }

  const content = evento as Event;
  const plainDescription = (content.description || '').replace(/<[^>]+>/g, '').substring(0, 160) + '...';

  return {
    title: `${content.title} | Círculo Italiano Miramar`,
    meta: [
      { name: 'description', content: plainDescription },
      { property: 'og:title', content: content.title },
      { property: 'og:description', content: plainDescription },
      { property: 'og:image', content: content.imageUrl || '' }, // URL de la portada
      { property: 'og:type', content: 'article' },
    ],
  };
};

export const onStaticGenerate = generateI18nPaths;
