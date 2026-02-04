import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import StoryblokClient from "storyblok-js-client";
import { renderRichText } from "@storyblok/js";

export const useEventos = routeLoader$(async (requestEvent) => {
    // Initialize the client manually for server-side loader
    const storyblokApi = new StoryblokClient({
        accessToken: requestEvent.env.get("PUBLIC_STORYBLOK_TOKEN"),
    });

    const { data } = await storyblokApi.get("cdn/stories", {
        version: "draft", // Or 'published'
        starts_with: "eventos/",
        is_startpage: false, // Exclude the folder itself if it exists as a story
    });

    const eventos = data.stories.sort((a: any, b: any) => {
        const dateA = new Date(a.content.fecha).getTime();
        const dateB = new Date(b.content.fecha).getTime();
        return dateB - dateA; // Descending order (newest first) seems appropriate for events, or user asked just "sort by date"
    });

    return eventos;
});

export default component$(() => {
    const eventos = useEventos();

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8 text-center">Eventos</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos.value.map((evento: any) => (
                    <div key={evento.uuid} class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {evento.content.imagen?.filename && (
                            <img
                                src={evento.content.imagen.filename}
                                alt={evento.content.imagen.alt || evento.content.titulo}
                                class="w-full h-48 object-cover"
                                width="400"
                                height="300"
                            />
                        )}
                        <div class="p-4">
                            <h2 class="text-xl font-semibold mb-2">{evento.content.titulo}</h2>
                            <p class="text-gray-600 mb-2">
                                {new Date(evento.content.fecha).toLocaleDateString()}
                            </p>
                            {evento.content.descripcion && (
                                <div
                                    class="text-gray-700 line-clamp-3 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={renderRichText(evento.content.descripcion)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
