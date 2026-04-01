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
      return new Intl.DateTimeFormat(currentLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

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
      <article class="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
        {content.imageUrl && (
          <img
            src={content.imageUrl}
            alt={content.imageAlt || content.title}
            class="h-96 w-full object-cover"
            width="800"
            height="400"
          />
        )}

        <div class="p-8">
          <header class="mb-6">
            <h1 class="mb-4 text-4xl font-bold leading-tight text-gray-900">
              {content.title}
            </h1>
            <div class="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 h-5 w-5 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span class="text-lg">
                {content.eventDate ? formatDate(content.eventDate) : "Fecha por confirmar"}
              </span>
            </div>
          </header>

          <div class="prose prose-lg max-w-none text-gray-700">
            <p class="whitespace-pre-wrap leading-relaxed">{content.description}</p>
          </div>
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
  return {
    title: `${content.title} | Círculo Italiano`,
    meta: [
      {
        name: "description",
        content: content.description?.slice(0, 160) || "",
      },
    ],
  };
};

export const onStaticGenerate = generateI18nPaths;
