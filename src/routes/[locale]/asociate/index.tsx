import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import { generateI18nPaths } from "~/utils/i18n-utils";

export default component$(() => {
  return (
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow-lg border border-gray-100">
          <div class="mb-8 text-center">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{_`join.title`}</h1>
            <p class="text-lg text-gray-600 leading-relaxed">
              {_`join.description`}
            </p>
          </div>

          <div class="space-y-6 text-gray-700 text-base leading-7">
            <p>
              {_`join.instructions`}
            </p>

            <div class="text-center">
              <Button class="bg-[#CE2B37] hover:bg-[#b52532] text-white font-semibold rounded-lg shadow-md transition-all border-2 border-[#b52532]">
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

            <p>
              {_`join.contact`}
            </p>
            <p class="text-center">
              <a href="mailto:socios@italianosenmiramar.com" class="text-[#009246] font-semibold hover:underline">
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