import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import ImageStory from "~/media/story.jpg?h=500&jsx";

export const History = component$(() => {
  const loc = useLocation();
  const currentLocale = loc.params.locale;

  return (
    <section class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div class="relative order-2 lg:order-1">
            <div class="absolute -inset-4 rounded-full bg-gradient-to-tr from-green-100 to-red-100 opacity-50 blur-3xl"></div>
            <div class="relative rotate-1 transform overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:rotate-0">
              <ImageStory
                class="h-auto w-full object-cover"
                alt={_`history.imageAlt`}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <p class="text-lg font-bold">{_`history.founded`}</p>
                <p class="text-sm opacity-90">{_`history.years`}</p>
              </div>
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <span class="mb-2 block text-sm font-bold tracking-wider text-green-700 uppercase">{_`history.tag`}</span>
            <h2 class="mb-6 font-serif text-4xl leading-tight font-bold text-gray-900">
              {_`history.title`}
            </h2>
            <p class="mb-6 text-lg leading-relaxed text-gray-600">
              {_`history.description1`}
            </p>
            <p class="mb-8 leading-relaxed text-gray-600">
              {_`history.description2`}
            </p>
            <Link href={`/${currentLocale}/nosotros`}>
              <Button class="transform rounded-full bg-gray-900 px-8 py-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl">
                {_`history.cta`}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
