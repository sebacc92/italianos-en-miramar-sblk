import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, Link } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";
import { renderRichText } from "@storyblok/js";

interface EventContent {
    titulo: string;
    descripcion?: any; // Storyblok Rich Text object
    fecha: string;
    imagen?: {
        filename: string;
        alt?: string;
    };
}

interface EventStory {
    uuid: string;
    full_slug: string;
    content: EventContent;
}

export const useEventos = routeLoader$(async ({ params, env }) => {
    const { locale } = params;

    // Get token from server environment
    const token = env.get('PUBLIC_STORYBLOK_TOKEN');

    if (!token) {
        console.error("Storyblok token not configured in environment");
        return [];
    }

    try {
        // Initialize Storyblok client directly
        const StoryblokClient = (await import('storyblok-js-client')).default;
        const client = new StoryblokClient({
            accessToken: token,
        });

        const { data } = await client.get("cdn/stories", {
            version: "published",
            starts_with: "eventos/",
            is_startpage: false,
            language: locale || "es",
        });

        // Sort by date (descending - most recent first)
        const eventos = (data.stories || []).sort((a: EventStory, b: EventStory) => {
            const dateA = new Date(a.content.fecha).getTime();
            const dateB = new Date(b.content.fecha).getTime();
            return dateB - dateA;
        });

        return eventos as EventStory[];
    } catch (error) {
        console.error("Error fetching eventos from Storyblok:", error);
        return [];
    }
});

export default component$(() => {
    const eventos = useEventos();
    const currentLocale = eventos.value[0]?.full_slug.split('/')[0] || 'es';

    // Helper to format date
    const formatDate = (dateString: string) => {
        // 1. Si no hay string, retornamos texto por defecto
        if (!dateString) return 'Fecha por confirmar';

        const date = new Date(dateString);

        // 2. Verificamos si la fecha es válida matemáticamente
        if (isNaN(date.getTime())) {
            return 'Fecha por confirmar';
        }

        try {
            return new Intl.DateTimeFormat(currentLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch {
            return dateString; // Fallback
        }
    };

    return (
        <div class="flex min-h-screen flex-col bg-gray-50">
            <main class="flex-1">
                {/* Hero Section */}
                <section class="bg-gradient-to-br from-green-700 via-green-600 to-green-800 py-16 text-white">
                    <div class="container mx-auto px-4 text-center">
                        <h1 class="text-4xl md:text-5xl font-bold mb-4">
                            {_`events.title`}
                        </h1>
                        <p class="text-xl text-green-100 max-w-2xl mx-auto">
                            {_`events.subtitle`}
                        </p>
                    </div>
                </section>

                {/* Events Grid */}
                <section class="py-16">
                    <div class="container mx-auto px-4">
                        {eventos.value.length === 0 ? (
                            <div class="text-center py-12">
                                <div class="w-20 h-20 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-700 mb-3">
                                    {_`events.noEvents`}
                                </h2>
                                <p class="text-gray-600">
                                    {_`events.noEventsDesc`}
                                </p>
                            </div>
                        ) : (
                            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                                {eventos.value.map((evento) => {
                                    const slug = evento.full_slug.replace(`${currentLocale}/eventos/`, '');

                                    return (
                                        <Card.Root key={evento.uuid} class="overflow-hidden hover:shadow-xl transition-shadow">
                                            {evento.content.imagen?.filename && (
                                                <div class="h-48 bg-gray-200 overflow-hidden">
                                                    <img
                                                        src={`${evento.content.imagen.filename}/m/600x400/smart`}
                                                        alt={evento.content.imagen.alt || evento.content.titulo}
                                                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        width="600"
                                                        height="400"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                            <Card.Header>
                                                <div class="flex items-center text-sm text-gray-500 mb-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                    </svg>
                                                    {formatDate(evento.content.fecha)}
                                                </div>
                                                <Card.Title class="text-xl mb-2 line-clamp-2">
                                                    {evento.content.titulo}
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Content>
                                                {evento.content.descripcion && (
                                                    <div
                                                        class="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={renderRichText(evento.content.descripcion)}
                                                    />
                                                )}
                                                <Link href={`/${currentLocale}/eventos/${slug}`}>
                                                    <Button variant="outline" fullWidth class="group">
                                                        {_`events.viewMore`}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    </Button>
                                                </Link>
                                            </Card.Content>
                                        </Card.Root>
                                    );
                                })}
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
