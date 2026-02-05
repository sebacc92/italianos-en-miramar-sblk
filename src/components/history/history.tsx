import { component$, } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import ImageStory from "~/media/story.jpg?h=500&jsx";

export const History = component$(() => {
    const loc = useLocation();
    const currentLocale = loc.params.locale;

    return (
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <div class="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
                    <div class="order-2 lg:order-1 relative">
                        <div class="absolute -inset-4 bg-gradient-to-tr from-green-100 to-red-100 rounded-full blur-3xl opacity-50"></div>
                        <div class="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <ImageStory class="w-full h-auto object-cover" alt={_`history.imageAlt`} />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div class="absolute bottom-6 left-6 text-white">
                                <p class="font-bold text-lg">{_`history.founded`}</p>
                                <p class="text-sm opacity-90">{_`history.years`}</p>
                            </div>
                        </div>
                    </div>

                    <div class="order-1 lg:order-2">
                        <span class="text-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">{_`history.tag`}</span>
                        <h2 class="text-4xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                            {_`history.title`}
                        </h2>
                        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                            {_`history.description1`}
                        </p>
                        <p class="text-gray-600 mb-8 leading-relaxed">
                            {_`history.description2`}
                        </p>
                        <Link href={`/${currentLocale}/nosotros`}>
                            <Button class="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                {_`history.cta`}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
});
