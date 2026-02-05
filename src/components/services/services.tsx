import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuApple, LuArrowRight, LuBrush, LuBuilding2, LuFileText, LuGraduationCap, LuLanguages, LuMusic, LuPalette } from "@qwikest/icons/lucide";

export const Services = component$(() => {
    const loc = useLocation();
    const currentLocale = loc.params.locale;

    return (
        <section class="py-20 bg-white relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <div class="container mx-auto px-4 relative z-10">
                <div class="text-center mb-16">
                    <span class="text-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">{_`services.whatWeDo`}</span>
                    <h2 id="servicios" class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                        {_`services.title`}
                    </h2>
                    <div class="w-24 h-1 bg-gradient-to-r from-green-600 via-white to-red-600 mx-auto rounded-full mb-6"></div>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {_`services.description`}
                    </p>
                </div>

                <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {/* Card 1: Idiomas */}
                    <Link href={`/${currentLocale}/idiomas`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <LuLanguages class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">{_`services.languages.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.languages.desc`}</p>
                                <span class="inline-flex items-center text-green-700 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.languages.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: Salones */}
                    <Link href={`/${currentLocale}/salones`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                                    <LuBuilding2 class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">{_`services.halls.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.halls.desc`}</p>
                                <span class="inline-flex items-center text-gray-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.halls.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: Ciudadanía */}
                    <Link href={`/${currentLocale}/ciudadania`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <LuFileText class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors">{_`services.citizenship.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.citizenship.desc`}</p>
                                <span class="inline-flex items-center text-red-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.citizenship.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 4: Eventos */}
                    <Link href={`/${currentLocale}/eventos`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <LuPalette class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">{_`services.culture.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.culture.desc`}</p>
                                <span class="inline-flex items-center text-green-700 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.culture.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 5: Escuela de Danzas */}
                    <Link href={`/${currentLocale}/danzas`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                    <LuMusic class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">{_`services.dance.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.dance.desc`}</p>
                                <span class="inline-flex items-center text-pink-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.dance.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 6: Taller de Arte */}
                    <Link href={`/${currentLocale}/clases/arte`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <LuBrush class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{_`services.art.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.art.desc`}</p>
                                <span class="inline-flex items-center text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.art.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 7: Nutrición y Salud */}
                    <Link href={`/${currentLocale}/nutricion`} class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <LuApple class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">{_`services.health.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.health.desc`}</p>
                                <span class="inline-flex items-center text-green-700 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.health.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Card 8: Universidad Siglo 21 */}
                    <a href="https://www.21.edu.ar/" target="_blank" rel="noopener noreferrer" class="group">
                        <div class="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <LuGraduationCap class="w-7 h-7" />
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">{_`services.university.title`}</h3>
                                <p class="text-gray-600 mb-6 leading-relaxed">{_`services.university.desc`}</p>
                                <span class="inline-flex items-center text-orange-700 font-semibold group-hover:translate-x-1 transition-transform">
                                    {_`services.university.cta`} <LuArrowRight class="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
});
