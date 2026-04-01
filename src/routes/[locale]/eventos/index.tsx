import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, Link, useLocation } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";

export const useEventos = routeLoader$(async ({ params, env }) => {
  const db = getDb(env);
  const locale = params.locale || "es";
  
  try {
    const eventos = await db
      .select()
      .from(events)
      .where(eq(events.language, locale as any))
      .orderBy(desc(events.eventDate));
      
    return eventos;
  } catch (error) {
    console.error("Error fetching eventos from Drizzle:", error);
    return [];
  }
});

export default component$(() => {
  const eventos = useEventos();
  const loc = useLocation();
  const currentLocale = loc.params.locale || "es";

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha por confirmar";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha por confirmar";

    try {
      return new Intl.DateTimeFormat(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      <main class="flex-1">
        {/* Hero Section */}
        <section class="bg-gradient-to-br from-green-700 via-green-600 to-green-800 py-16 text-white">
          <div class="container mx-auto px-4 text-center">
            <h1 class="mb-4 text-4xl font-bold md:text-5xl">
              {_`events.title`}
            </h1>
            <p class="mx-auto max-w-2xl text-xl text-green-100">
              {_`events.subtitle`}
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section class="py-16">
          <div class="container mx-auto px-4">
            {eventos.value.length === 0 ? (
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
              <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                {eventos.value.map((evento) => (
                  <Card.Root
                    key={evento.id}
                    class="overflow-hidden transition-shadow hover:shadow-xl"
                  >
                    {evento.imageUrl && (
                      <div class="h-48 overflow-hidden bg-gray-200">
                        <img
                          src={evento.imageUrl}
                          alt={evento.imageAlt || evento.title}
                          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          width="600"
                          height="400"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <Card.Header>
                      <div class="mb-2 flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="mr-2 h-4 w-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                        {evento.eventDate ? formatDate(evento.eventDate) : "Fecha por confirmar"}
                      </div>
                    </Card.Header>
                    <Card.Content>
                      <Card.Title class="mb-2 line-clamp-2 text-xl">
                        {evento.title}
                      </Card.Title>
                      {evento.description && (
                        <p class="mb-4 line-clamp-3 text-sm text-gray-600">
                          {evento.description}
                        </p>
                      )}
                      
                      {/* Aquí pasamos el ID en lugar del slug */}
                      <Link href={`/${currentLocale}/eventos/${evento.id}`}>
                        <Button variant="outline" fullWidth class="group">
                          {_`events.viewMore`}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </Button>
                      </Link>
                    </Card.Content>
                  </Card.Root>
                ))}
              </div>
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
