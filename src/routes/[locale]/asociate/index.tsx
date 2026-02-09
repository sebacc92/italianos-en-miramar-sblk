import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import { generateI18nPaths } from "~/utils/i18n-utils";

export default component$(() => {
  return (
    <section class="bg-gray-50 py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-10 shadow-lg">
          <div class="mb-8 text-center">
            <h1 class="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">{_`join.title`}</h1>
            <p class="text-lg leading-relaxed text-gray-600">
              {_`join.description`}
            </p>
          </div>

          <div class="space-y-6 text-base leading-7 text-gray-700">
            <p>{_`join.instructions`}</p>

            <div class="text-center">
              <Button class="rounded-lg border-2 border-[#b52532] bg-[#CE2B37] font-semibold text-white shadow-md transition-all hover:bg-[#b52532]">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScG3LutdBihmc9wf2d7LW1xv_gepQJe_GxwJ9fA41o-BTwinQ/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block px-6 py-2"
                >
                  {_`join.button`}
                </a>
              </Button>
            </div>

            <p>{_`join.contact`}</p>
            <p class="text-center">
              <a
                href="mailto:socios@italianosenmiramar.com"
                class="font-semibold text-[#009246] hover:underline"
              >
                socios@italianosenmiramar.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: _`join.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`join.metaDescription`,
    },
  ],
};

// La re-exportas como onStaticGenerate
export const onStaticGenerate = generateI18nPaths;
