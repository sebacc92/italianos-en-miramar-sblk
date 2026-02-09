import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import Img1 from "~/media/story1.jpeg?jsx";
import Img2 from "~/media/story2.jpeg?jsx";
import Img3 from "~/media/story3.jpeg?jsx";
import Img4 from "~/media/story4.jpeg?jsx";
import Img5 from "~/media/story5.jpeg?jsx";
import Img6 from "~/media/story6.jpeg?jsx";
import { generateI18nPaths } from "~/utils/i18n-utils";

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      <main class="flex-1">
        {/* Hero Section */}
        <section class="bg-gradient-to-r from-green-600/80 via-white to-red-600/80 py-20 md:py-24">
          <div class="container mx-auto px-4">
            <div class="text-center">
              <h1 class="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">{_`about.title`}</h1>
              <p class="mx-auto mb-6 max-w-2xl text-lg text-gray-600 md:text-xl">{_`about.subtitle`}</p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section class="py-16">
          <div class="container mx-auto px-4">
            <div class="mb-10 text-center">
              <h2 class="mb-2 text-2xl font-semibold text-gray-700">{_`about.visualTour`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">{_`about.visualTourDesc`}</p>
            </div>
            <div class="mx-auto max-w-6xl">
              <div class="grid gap-6 md:grid-cols-2">
                {/* Video 1: Historia */}
                <div class="relative overflow-hidden rounded-lg border border-gray-200 shadow-lg">
                  <div class="aspect-video">
                    <iframe
                      class="absolute top-0 left-0 h-full w-full"
                      src="https://www.youtube.com/embed/R_BO4w1h7AE"
                      title={_`about.videoTitle`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullscreen
                    ></iframe>
                  </div>
                </div>

                {/* Video 2: Institucional */}
                <div class="relative overflow-hidden rounded-lg border border-gray-200 shadow-lg">
                  <div class="aspect-video">
                    <iframe
                      class="absolute top-0 left-0 h-full w-full"
                      src="https://www.youtube.com/embed/VvTIlRmZu8E"
                      title={_`about.videoTitle2`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullscreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Origins Section */}
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
              <div>
                <h2 class="mb-6 text-3xl font-bold text-gray-800">{_`about.origins`}</h2>
                <div class="space-y-5 text-gray-700">
                  <p>{_`about.originsP1`}</p>
                  <p>{_`about.originsP2`}</p>
                  <p>{_`about.originsP3`}</p>
                </div>
              </div>
              <div class="relative flex h-[400px] items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NiEgbBGLEnpWXV5RvzgV6n1MOyUvJo.png"
                  alt={_`about.originsImgAlt`}
                  class="h-full max-h-[350px] rounded-md object-contain shadow-md"
                  width={500}
                  height={350}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section class="bg-gray-100 py-16">
          <div class="container mx-auto px-4">
            <h2 class="mb-12 text-center text-3xl font-bold text-gray-800">{_`about.timeline`}</h2>

            <div class="mx-auto max-w-3xl">
              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    1889
                  </h3>
                  <p class="text-gray-600">{_`about.timeline1889`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    1959
                  </h3>
                  <p class="text-gray-600">{_`about.timeline1959`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2000
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2000`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2002
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2002`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2005
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2005`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2009
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2009`}</p>
                </div>
              </div>

              <div class="relative border-l-2 border-green-600 pb-10 pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div class="mb-8">
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2010
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2010`}</p>
                </div>
              </div>

              <div class="relative pl-10">
                <div class="absolute top-0 -left-[11px] h-5 w-5 rounded-full border-2 border-white bg-green-600"></div>
                <div>
                  <h3 class="mb-2 text-xl font-semibold text-green-700">
                    2024
                  </h3>
                  <p class="text-gray-600">{_`about.timeline2024`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold text-gray-800">{_`about.legacy`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">
                {_`about.legacySubtitle`}
              </p>
            </div>

            <div class="mx-auto max-w-3xl">
              <div>
                <h3 class="mb-4 text-center text-2xl font-bold text-gray-800 md:text-left">{_`about.communitySpace`}</h3>
                <div class="space-y-4 text-gray-700">
                  <p>{_`about.legacyP1`}</p>
                  <p>{_`about.legacyP2`}</p>
                  <p>{_`about.legacyP3`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section class="bg-gray-100 py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold text-gray-800">{_`about.values`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">
                {_`about.valuesSubtitle`}
              </p>
            </div>

            <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">🤝</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valCommunity`}</h3>
                <p class="text-gray-600">{_`about.valCommunityDesc`}</p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">🏛️</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valCulture`}</h3>
                <p class="text-gray-600">{_`about.valCultureDesc`}</p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">📚</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valEducation`}</h3>
                <p class="text-gray-600">{_`about.valEducationDesc`}</p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">🌉</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valIntegration`}</h3>
                <p class="text-gray-600">{_`about.valIntegrationDesc`}</p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">🔄</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valTradition`}</h3>
                <p class="text-gray-600">{_`about.valTraditionDesc`}</p>
              </div>

              <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span class="text-2xl text-green-700">🤲</span>
                </div>
                <h3 class="mb-2 text-xl font-semibold text-gray-800">{_`about.valSolidarity`}</h3>
                <p class="text-gray-600">{_`about.valSolidarityDesc`}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
              <h2 class="mb-2 text-3xl font-bold text-gray-800">{_`about.gallery`}</h2>
              <p class="mx-auto max-w-2xl text-gray-600">{_`about.gallerySubtitle`}</p>
            </div>

            <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img1 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img2 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img3 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img4 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img5 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div class="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                <Img6 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section class="bg-gray-100 py-20">
          <div class="container mx-auto px-4">
            <div class="mx-auto max-w-3xl text-center">
              <blockquote class="relative mb-6 rounded-r-lg border-l-4 border-green-500 bg-white p-6 text-xl text-gray-700 italic shadow">
                <span class="absolute top-2 left-2 text-5xl text-green-300 opacity-50">
                  “
                </span>
                "{_`about.quote`}"
                <span class="absolute right-2 bottom-2 text-5xl text-green-300 opacity-50">
                  ”
                </span>
              </blockquote>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: _`about.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`about.metaDescription`,
    },
  ],
};

// La re-exportas como onStaticGenerate
export const onStaticGenerate = generateI18nPaths;
