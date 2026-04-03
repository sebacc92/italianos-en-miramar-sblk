import { component$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$, Link } from "@builder.io/qwik-city";
import HeroSlider from "~/components/HeroSlider/HeroSlider";
import { _ } from "compiled-i18n";
import { stripHtml } from "~/utils/stringUtils";
import { Services } from "~/components/services/services";
import { History } from "~/components/history/history";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { Card } from "~/components/ui/card/card";

export const useRecentEvents = routeLoader$(async ({ params, env }) => {
  const db = getDb(env);
  const locale = params.locale || "es";
  
  try {
    return await db.select().from(events)
      .where(eq(events.language, locale as any))
      .orderBy(desc(events.eventDate))
      .limit(3);
  } catch (e) {
    console.error(e);
    return [];
  }
});

export default component$(() => {
  const title = _`home.title`;
  const subtitle = _`home.subtitle`;
  const recentEvents = useRecentEvents();

  return (
    <>
      <HeroSlider description={subtitle} title={title} />

      {/* Featured Events dynamically loaded from Drizzle */}
      {recentEvents.value.length > 0 && (
        <section class="py-16 bg-gray-50">
          <div class="container mx-auto px-4">
             <div class="mb-12 text-center">
              <span class="mb-2 block text-sm font-bold tracking-wider text-green-700 uppercase">
                NOVEDADES
              </span>
              <h2 class="mb-4 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
                Eventos Destacados
              </h2>
              <div class="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-green-600 via-white to-red-600"></div>
             </div>

             <div class="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
               {recentEvents.value.map(ev => (
                 <Card.Root key={ev.id} class="overflow-hidden hover:shadow-xl transition-shadow bg-white flex flex-col">
                    {ev.imageUrl && (
                      <div class="h-48 bg-gray-200">
                        <img src={ev.imageUrl} class="w-full h-full object-cover" alt={ev.title} />
                      </div>
                    )}
                    <Card.Header>
                      {ev.eventDate && (
                        <small class="text-green-700 font-semibold uppercase">{ev.eventDate}</small>
                      )}
                      <Card.Title class="mt-1 line-clamp-1">{ev.title}</Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col flex-1">
                       <p class="text-gray-600 line-clamp-2 text-sm mb-4 flex-1">
                          {stripHtml(ev.description || "")}
                       </p>
                       <Link href={`/${recentEvents.value[0].language}/eventos/${ev.id}`} class="mt-auto text-green-700 font-bold hover:underline">
                         Ver detalles →
                       </Link>
                    </Card.Content>
                 </Card.Root>
               ))}
             </div>

             <div class="mt-10 text-center">
               <Link href={`/${recentEvents.value[0].language}/eventos/`} class="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:scale-95">
                 Ver todos los eventos
               </Link>
             </div>
          </div>
        </section>
      )}

      <Services />
      <History />
    </>
  );
});

export const head: DocumentHead = {
  title: _`home.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`home.metaDescription`,
    },
  ],
};
