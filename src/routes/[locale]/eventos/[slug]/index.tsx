// import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
// import { routeLoader$ } from "@builder.io/qwik-city";
// import { storyblokEditable, type ISbStoryData, renderRichText } from "@storyblok/js";

// // Custom hook to handle Storyblok Bridge
// interface EventStoryContent {
//     titulo: string;
//     fecha: string;
//     imagen?: {
//         filename: string;
//         alt?: string;
//     };
//     descripcion: any; // RichText object
//     _editable?: string;
//     [key: string]: any;
// }

// export function useStoryblok(originalStory: ISbStoryData) {
//     const story = useSignal(originalStory);

//     // eslint-disable-next-line qwik/no-use-visible-task
//     useVisibleTask$(() => {
//         const { StoryblokBridge, location } = window as any;

//         if (typeof StoryblokBridge !== "undefined") {
//             const bridge = new StoryblokBridge();

//             bridge.on(["input", "published", "change"], (event: any) => {
//                 if (event.action === "input" && event.story.id === story.value.id) {
//                     story.value = event.story;
//                 } else if (event.action === "change" || event.action === "published") {
//                     location.reload();
//                 }
//             });
//         }
//     });

//     return story;
// }

// export const useEventoDetail = routeLoader$(async ({ params, fail }) => {
//     const storyblokApi = getStoryblokApi();
//     try {
//         const { data } = await storyblokApi.get(`cdn/stories/eventos/${params.slug}`, {
//             version: "draft",
//             language: params.locale,
//         });
//         return data.story;
//     } catch (error) {
//         console.error(error);
//         return fail(404, { errorMessage: "Evento no encontrado" });
//     }
// });

// export default component$(() => {
//     const storySignal = useEventoDetail();

//     // Bridge for Live Preview
//     const story = useStoryblok(storySignal.value as ISbStoryData);

//     if (!story.value) {
//         return <div>Cargando...</div>;
//     }

//     const content = story.value.content as EventStoryContent;

//     // Optimize image URL if present
//     const imageUrl = content.imagen?.filename?.replace("//a.storyblok.com", "//a.storyblok.com/m/");

//     return (
//         <div
//             class="container mx-auto px-4 py-8"
//             {...storyblokEditable(content)}
//         >
//             <article class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//                 {imageUrl && (
//                     <img
//                         src={imageUrl}
//                         alt={content.imagen?.alt || content.titulo}
//                         class="w-full h-96 object-cover"
//                         width="800"
//                         height="400"
//                     />
//                 )}

//                 <div class="p-8">
//                     <header class="mb-6">
//                         <h1 class="text-4xl font-bold mb-4 text-gray-900 leading-tight">
//                             {content.titulo}
//                         </h1>
//                         <div class="flex items-center text-gray-600">
//                             <span class="text-lg">
//                                 {new Date(content.fecha).toLocaleDateString(undefined, {
//                                     weekday: 'long',
//                                     year: 'numeric',
//                                     month: 'long',
//                                     day: 'numeric'
//                                 })}
//                             </span>
//                         </div>
//                     </header>

//                     <div class="prose prose-lg max-w-none text-gray-700">
//                         {/* RichText rendering would require a parser. 
//                  Since renderRichText from SDK is not available/reliable in this context without SDK,
//                  we'll strip it or check if @storyblok/js exports renderRichText.
//                  @storyblok/js DOES export RichTextResolver but renderRichText might be separate. 
//                  Actually 'storyblok-js-client' has rich text resolver.
//                  Let's try to use renderRichText from @storyblok/js if available or simple HTML if it's a string.
//                  For now, we will output it carefully.
//              */}
//                         <div dangerouslySetInnerHTML={renderRichText(content.descripcion)} />
//                     </div>
//                 </div>
//             </article>
//         </div>
//     );
// });
