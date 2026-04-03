import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, Link, useLocation } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { eq, desc, sql } from "drizzle-orm";
import { stripHtml } from "~/utils/stringUtils";
import { EventCard } from "~/components/events/EventCard";
import { PageHero } from "~/components/ui/PageHero";

export const useEventos = routeLoader$(async ({ params, env, url }) => {
  const db = getDb(env);
  const locale = params.locale || "es";
  
  const pageParam = url.searchParams.get("page");
  const currentPage = parseInt(pageParam || "1", 10) || 1;
  const pageSize = 12;
  
  try {
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.language, locale as any));
    
    const totalEvents = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(totalEvents / pageSize);

    const eventos = await db
      .select()
      .from(events)
      .where(eq(events.language, locale as any))
      .orderBy(desc(events.eventDate))
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize);
      
    return {
      events: eventos,
      currentPage,
      totalPages,
      totalEvents
    };
  } catch (error) {
    console.error("Error fetching eventos from Drizzle:", error);
    return { events: [], currentPage: 1, totalPages: 0, totalEvents: 0 };
  }
});

export default component$(() => {
  const eventos = useEventos();
  const loc = useLocation();
  const currentLocale = loc.params.locale || "es";

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      <main class="flex-1">
        {/* Hero Section */}
        <PageHero
          title={_`events.title`}
          description={_`events.subtitle`}
        />

        {/* Events Grid */}
        <section class="py-16">
          <div class="container mx-auto px-4">
            {eventos.value.events.length === 0 ? (
              <div class="py-12 text-center">
                <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-10 w-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </div>
                <h2 class="mb-3 text-2xl font-bold text-gray-700">
                  {_`events.noEvents`}
                </h2>
                <p class="text-gray-600">{_`events.noEventsDesc`}</p>
              </div>
            ) : (
              <>
                <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {eventos.value.events.map((evento) => (
                    <EventCard key={evento.id} evento={evento as any} />
                  ))}
                </div>
                
                {/* Pagination Control */}
                {eventos.value.totalPages > 1 && (
                  <div class="mt-16 flex justify-center items-center gap-4">
                    <Link
                      href={`/${currentLocale}/eventos?page=${eventos.value.currentPage - 1}`}
                      class={`rounded-md px-4 py-2 font-medium transition-colors ${
                        eventos.value.currentPage <= 1 
                          ? "bg-gray-200 text-gray-400 pointer-events-none" 
                          : "bg-white text-green-700 hover:bg-green-50 border border-green-200 shadow-sm"
                      }`}
                    >
                      Anterior
                    </Link>
                    <span class="text-sm font-medium text-gray-600">
                      Página {eventos.value.currentPage} de {eventos.value.totalPages}
                    </span>
                    <Link
                      href={`/${currentLocale}/eventos?page=${eventos.value.currentPage + 1}`}
                      class={`rounded-md px-4 py-2 font-medium transition-colors ${
                        eventos.value.currentPage >= eventos.value.totalPages
                          ? "bg-gray-200 text-gray-400 pointer-events-none" 
                          : "bg-white text-green-700 hover:bg-green-50 border border-green-200 shadow-sm"
                      }`}
                    >
                      Siguiente
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: _`events.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`events.metaDescription`,
    },
  ],
};

export const onStaticGenerate = generateI18nPaths;
