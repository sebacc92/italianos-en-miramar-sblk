import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuMapPin, LuMail, LuPhone } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/button/button";
import { generateI18nPaths } from "~/utils/i18n-utils";

export const head: DocumentHead = {
  title: _`contact.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`contact.metaDesc`,
    },
  ],
};

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Section */}
      <section class="bg-gradient-to-r from-green-600/80 via-white to-red-600/80 py-20 md:py-24">
        <div class="container mx-auto px-4">
          <div class="text-center">
            <h1 class="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">{_`Contacto`}</h1>
            <p class="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              {_`Estamos aquí para ayudarte`}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main class="container mx-auto px-4 py-16">
        <div class="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div>
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-800 mb-4">{_`Envíanos un mensaje`}</h2>
              <p class="text-gray-600">
                {_`¿Tienes dudas, consultas o quieres comunicarte con nosotros? Completa el formulario y te responderemos a la brevedad.`}
              </p>
            </div>

            <form class="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div>
                <label class="block mb-2 font-semibold text-gray-700" for="nombre">
                  {_`Nombre y apellido`}
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label class="block mb-2 font-semibold text-gray-700" for="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label class="block mb-2 font-semibold text-gray-700" for="asunto">
                  {_`Asunto`}
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="Consulta sobre clases de italiano"
                />
              </div>

              <div>
                <label class="block mb-2 font-semibold text-gray-700" for="mensaje">
                  {_`Mensaje`}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={6}
                  required
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <Button
                type="submit"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all border-2 border-green-700 px-8 py-3 text-lg cursor-pointer"
              >
                {_`Enviar mensaje`}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div class="space-y-8">
            {/* Contact Information Cards */}
            <div>
              <h2 class="text-3xl font-bold text-gray-800 mb-6">{_`Información de contacto`}</h2>

              <div class="space-y-4">
                {/* Address */}
                <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <LuMapPin class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 mb-1">{_`Dirección`}</h3>
                      <p class="text-gray-600">Mutual Cultural Círculo Italiano Joven Italia</p>
                      <p class="text-gray-600">Calle 24 n°1214, Miramar</p>
                      <p class="text-gray-600">Buenos Aires, Argentina</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <LuMail class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 mb-1">Email</h3>
                      <a
                        href="mailto:italianos@miramarense.com.ar"
                        class="text-green-700 hover:text-green-700 font-medium hover:underline"
                      >
                        italianos@miramarense.com.ar
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <LuPhone class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 mb-1">{_`Teléfono`}</h3>
                      <a
                        href="tel:+542291433766"
                        class="text-green-700 hover:text-green-700 font-medium hover:underline"
                      >
                        (02291) 43-3766
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">{_`Cómo llegar`}</h3>
              <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d886.6801414036926!2d-57.83928588009304!3d-38.27163142202117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95851062f02a2eef%3A0xd4ffbfea83c5b8ab!2sMutual%20Cultural%2C%20Circulo%20Italiano%2C%20Joven%20Italia%20de%20Miramar!5e0!3m2!1ses!2sar!4v1764053973075!5m2!1ses!2sar"
                  width="600"
                  height="450"
                  style="border:0;"
                  allowFullscreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

// La re-exportas como onStaticGenerate
export const onStaticGenerate = generateI18nPaths;