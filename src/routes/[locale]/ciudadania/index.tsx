import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  LuCheck,
  LuFileText,
  LuHelpCircle,
  LuInfo,
} from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/button/button";
import { Accordion } from "~/components/ui/accordion/accordion";
import DocumentosParaCiudadaniaItalianaImg from "~/media/documentos_para_ciudadania_italiana.png?jsx";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col">
      <main class="flex-1">
        {/* Hero Section */}
        <section class="bg-gradient-to-r from-red-600 via-white to-green-600 py-16">
          <div class="container mx-auto px-4">
            <div class="text-center">
              <h1 class="mb-4 text-4xl font-bold">{_`citizenship.title`}</h1>
              <p class="mx-auto mb-6 max-w-2xl text-lg">
                {_`citizenship.subtitle`}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold">{_`citizenship.services.title`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">
                {_`citizenship.services.subtitle`}
              </p>
            </div>

            <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div class="rounded border shadow-sm">
                <div class="border-b p-6">
                  <LuInfo class="mb-2 h-10 w-10 text-green-700" />
                  <h3 class="text-xl font-medium">{_`citizenship.services.s1.title`}</h3>
                </div>
                <div class="p-6">
                  <p class="text-gray-600">{_`citizenship.services.s1.desc`}</p>
                </div>
              </div>

              <div class="rounded border shadow-sm">
                <div class="border-b p-6">
                  <LuFileText class="mb-2 h-10 w-10 text-red-600" />
                  <h3 class="text-xl font-medium">{_`citizenship.services.s2.title`}</h3>
                </div>
                <div class="p-6">
                  <p class="text-gray-600">{_`citizenship.services.s2.desc`}</p>
                </div>
              </div>

              <div class="rounded border shadow-sm">
                <div class="border-b p-6">
                  <LuHelpCircle class="mb-2 h-10 w-10 text-green-700" />
                  <h3 class="text-xl font-medium">{_`citizenship.services.s3.title`}</h3>
                </div>
                <div class="p-6">
                  <p class="text-gray-600">{_`citizenship.services.s3.desc`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section class="bg-gray-100 py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold">{_`citizenship.process.title`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">
                {_`citizenship.process.subtitle`}
              </p>
            </div>

            <div class="mx-auto max-w-3xl">
              <div class="relative border-l border-green-600 pb-12 pl-8">
                <div class="absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  1
                </div>
                <div>
                  <h3 class="mb-2 text-xl font-bold">{_`citizenship.process.step1.title`}</h3>
                  <p class="text-gray-600">
                    {_`citizenship.process.step1.desc`}
                  </p>
                </div>
              </div>

              <div class="relative border-l border-green-600 pb-12 pl-8">
                <div class="absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  2
                </div>
                <div>
                  <h3 class="mb-2 text-xl font-bold">{_`citizenship.process.step2.title`}</h3>
                  <p class="text-gray-600">
                    {_`citizenship.process.step2.desc`}
                  </p>
                </div>
              </div>

              <div class="relative border-l border-green-600 pb-12 pl-8">
                <div class="absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  3
                </div>
                <div>
                  <h3 class="mb-2 text-xl font-bold">{_`citizenship.process.step3.title`}</h3>
                  <p class="text-gray-600">
                    {_`citizenship.process.step3.desc`}
                  </p>
                </div>
              </div>

              <div class="relative border-l border-green-600 pb-12 pl-8">
                <div class="absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  4
                </div>
                <div>
                  <h3 class="mb-2 text-xl font-bold">{_`citizenship.process.step4.title`}</h3>
                  <p class="text-gray-600">
                    {_`citizenship.process.step4.desc`}
                  </p>
                </div>
              </div>

              <div class="relative pl-8">
                <div class="absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  5
                </div>
                <div>
                  <h3 class="mb-2 text-xl font-bold">{_`citizenship.process.step5.title`}</h3>
                  <p class="text-gray-600">
                    {_`citizenship.process.step5.desc`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
              <div>
                <h2 class="mb-6 text-3xl font-bold">{_`citizenship.requirements.title`}</h2>
                <div class="space-y-4">
                  <div class="flex items-start gap-2">
                    <LuCheck class="mt-1 h-5 w-5 text-green-700" />
                    <p>{_`citizenship.requirements.req1`}</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <LuCheck class="mt-1 h-5 w-5 text-green-700" />
                    <p>{_`citizenship.requirements.req2`}</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <LuCheck class="mt-1 h-5 w-5 text-green-700" />
                    <p>{_`citizenship.requirements.req3`}</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <LuCheck class="mt-1 h-5 w-5 text-green-700" />
                    <p>{_`citizenship.requirements.req4`}</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <LuCheck class="mt-1 h-5 w-5 text-green-700" />
                    <p>{_`citizenship.requirements.req5`}</p>
                  </div>
                </div>
              </div>
              <div class="relative">
                <DocumentosParaCiudadaniaItalianaImg />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section class="bg-gray-100 py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold">{_`citizenship.faq.title`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">
                {_`citizenship.faq.subtitle`}
              </p>
            </div>

            <Accordion.Root
              class="mx-auto max-w-3xl"
              collapsible
              behavior="single"
            >
              <Accordion.Item class="mb-2 rounded border bg-white">
                <Accordion.Trigger class="px-6 py-4">
                  {_`citizenship.faq.q1`}
                </Accordion.Trigger>
                <Accordion.Content class="px-6 pb-4">
                  {_`citizenship.faq.a1`}
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item class="mb-2 rounded border bg-white">
                <Accordion.Trigger class="px-6 py-4">
                  {_`citizenship.faq.q2`}
                </Accordion.Trigger>
                <Accordion.Content class="px-6 pb-4">
                  {_`citizenship.faq.a2`}
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item class="mb-2 rounded border bg-white">
                <Accordion.Trigger class="px-6 py-4">
                  {_`citizenship.faq.q3`}
                </Accordion.Trigger>
                <Accordion.Content class="px-6 pb-4">
                  {_`citizenship.faq.a3`}
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item class="mb-2 rounded border bg-white">
                <Accordion.Trigger class="px-6 py-4">
                  {_`citizenship.faq.q4`}
                </Accordion.Trigger>
                <Accordion.Content class="px-6 pb-4">
                  {_`citizenship.faq.a4`}
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item class="mb-2 rounded border bg-white">
                <Accordion.Trigger class="px-6 py-4">
                  {_`citizenship.faq.q5`}
                </Accordion.Trigger>
                <Accordion.Content class="px-6 pb-4">
                  {_`citizenship.faq.a5`}
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </section>

        {/* CTA Section */}
        <section class="bg-gradient-to-r from-green-600 via-white to-red-600 py-16">
          <div class="container mx-auto px-4">
            <div class="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
              <div class="text-center">
                <h2 class="mb-4 text-3xl font-bold">{_`citizenship.cta.title`}</h2>
                <p class="mb-6 text-gray-600">{_`citizenship.cta.desc`}</p>
                <Button
                  look="primary"
                  size="lg"
                  class="bg-green-600 hover:bg-green-700"
                >
                  <Link href="/contacto?asunto=tramites">{_`citizenship.cta.button`}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: _`citizenship.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`citizenship.metaDescription`,
    },
  ],
};

// La re-exportas como onStaticGenerate
export const onStaticGenerate = generateI18nPaths;
