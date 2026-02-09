import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import {
  LuApple,
  LuArrowRight,
  LuBrush,
  LuBuilding2,
  LuFileText,
  LuGraduationCap,
  LuLanguages,
  LuMusic,
  LuPalette,
} from "@qwikest/icons/lucide";

export const Services = component$(() => {
  const loc = useLocation();
  const currentLocale = loc.params.locale;

  return (
    <section class="relative overflow-hidden bg-white py-20">
      <div class="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div class="relative z-10 container mx-auto px-4">
        <div class="mb-16 text-center">
          <span class="mb-2 block text-sm font-bold tracking-wider text-green-700 uppercase">{_`services.whatWeDo`}</span>
          <h2
            id="servicios"
            class="mb-4 font-serif text-4xl font-bold text-gray-900 md:text-5xl"
          >
            {_`services.title`}
          </h2>
          <div class="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-green-600 via-white to-red-600"></div>
          <p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
            {_`services.description`}
          </p>
        </div>

        <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Idiomas */}
          <Link href={`/${currentLocale}/idiomas`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-green-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <LuLanguages class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">{_`services.languages.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.languages.desc`}</p>
                <span class="inline-flex items-center font-semibold text-green-700 transition-transform group-hover:translate-x-1">
                  {_`services.languages.cta`}{" "}
                  <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Salones */}
          <Link href={`/${currentLocale}/salones`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-gray-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-gray-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-600 group-hover:text-white">
                  <LuBuilding2 class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-gray-700">{_`footer.service.rentals`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.halls.desc`}</p>
                <span class="inline-flex items-center font-semibold text-gray-600 transition-transform group-hover:translate-x-1">
                  {_`services.halls.cta`} <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3: Eventos */}
          <Link href={`/${currentLocale}/eventos`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-green-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <LuPalette class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">{_`services.culture.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.culture.desc`}</p>
                <span class="inline-flex items-center font-semibold text-green-700 transition-transform group-hover:translate-x-1">
                  {_`services.culture.cta`}{" "}
                  <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 4: Ciudadanía */}
          <Link href={`/${currentLocale}/ciudadania`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-red-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-red-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                  <LuFileText class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-red-700">{_`services.citizenship.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.citizenship.desc`}</p>
                <span class="inline-flex items-center font-semibold text-red-600 transition-transform group-hover:translate-x-1">
                  {_`services.citizenship.cta`}{" "}
                  <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 5: Escuela de Danzas */}
          <Link href={`/${currentLocale}/danzas`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-pink-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-pink-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white">
                  <LuMusic class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-pink-700">{_`services.dance.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.dance.desc`}</p>
                <span class="inline-flex items-center font-semibold text-pink-600 transition-transform group-hover:translate-x-1">
                  {_`services.dance.cta`} <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 6: Taller de Arte */}
          <Link href={`/${currentLocale}/clases/arte`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-purple-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <LuBrush class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-700">{_`services.art.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.art.desc`}</p>
                <span class="inline-flex items-center font-semibold text-purple-600 transition-transform group-hover:translate-x-1">
                  {_`services.art.cta`} <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 7: Nutrición y Salud */}
          <Link href={`/${currentLocale}/nutricion`} class="group">
            <div class="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-green-50 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <LuApple class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">{_`services.health.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-600">{_`services.health.desc`}</p>
                <span class="inline-flex items-center font-semibold text-green-700 transition-transform group-hover:translate-x-1">
                  {_`services.health.cta`} <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 8: Universidad Siglo 21 */}
          <a
            href="https://www.21.edu.ar/"
            target="_blank"
            rel="noopener noreferrer"
            class="group"
          >
            <div class="relative h-full overflow-hidden rounded-2xl border border-transparent bg-[#005696] p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-[#004b8d] hover:shadow-2xl">
              <div class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-bl-full bg-white/5 transition-transform group-hover:scale-110"></div>
              <div class="relative z-10">
                <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F39200] text-white shadow-sm transition-colors group-hover:bg-[#FFD700]">
                  <LuGraduationCap class="h-7 w-7" />
                </div>
                <h3 class="mb-3 text-xl font-bold text-white transition-colors">{_`services.university.title`}</h3>
                <p class="mb-6 leading-relaxed text-gray-100">{_`services.university.desc`}</p>
                <span class="inline-flex items-center font-bold text-white transition-transform group-hover:translate-x-1 group-hover:text-[#FFD700]">
                  {_`services.university.cta`}{" "}
                  <LuArrowRight class="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
});
