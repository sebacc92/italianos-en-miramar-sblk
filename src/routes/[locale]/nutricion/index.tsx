import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuHeart, LuStethoscope, LuApple } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col">
      <main class="flex-1">
        {/* Hero Section */}
        <section class="relative overflow-hidden bg-green-600 py-20 text-white">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative container mx-auto px-4 text-center">
            <h1 class="mb-6 text-5xl font-bold">{_`nutrition.title`}</h1>
            <p class="mx-auto max-w-2xl text-xl text-green-50">
              {_`nutrition.subtitle`}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section class="bg-white py-20">
          <div class="container mx-auto px-4">
            <div class="mx-auto max-w-4xl text-center">
              <div class="mb-12">
                <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <LuApple class="h-10 w-10" />
                </div>
                <h2 class="mb-6 text-3xl font-bold text-gray-900">{_`nutrition.consulting.title`}</h2>
                <p class="text-xl leading-relaxed text-gray-600">
                  {_`nutrition.consulting.desc`}
                </p>
              </div>

              <div class="mt-16 grid gap-8 md:grid-cols-2">
                <div class="rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md">
                  <LuHeart class="mx-auto mb-4 h-8 w-8 text-red-500" />
                  <h3 class="mb-2 text-lg font-bold text-gray-900">{_`nutrition.benefits.title`}</h3>
                  <p class="text-gray-600">{_`nutrition.benefits.desc`}</p>
                </div>
                <div class="rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md">
                  <LuStethoscope class="mx-auto mb-4 h-8 w-8 text-blue-500" />
                  <h3 class="mb-2 text-lg font-bold text-gray-900">{_`nutrition.professional.title`}</h3>
                  <p class="text-gray-600">{_`nutrition.professional.desc`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: _`nutrition.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`nutrition.metaDescription`,
    },
  ],
};
