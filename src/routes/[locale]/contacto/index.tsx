import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeAction$,
  zod$,
  z,
  Form,
} from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import {
  LuMapPin,
  LuMail,
  LuPhone,
  LuCheckCircle,
  LuAlertCircle,
} from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { generateI18nPaths } from "~/utils/i18n-utils";

// Declaración para TypeScript de window.turnstile
declare global {
  interface Window {
    turnstile: any;
  }
}

// Acción para enviar el el email y validar Turnstile
export const useSendContactEmail = routeAction$(
  async (data, requestEvent) => {
    const turnstileToken = data["cf-turnstile-response"];
    const turnstileSecret = requestEvent.env.get("TURNSTILE_SECRET_KEY");

    // Validación de Turnstile (lado del servidor)
    if (turnstileSecret && turnstileToken) {
      try {
        const formData = new FormData();
        formData.append("secret", turnstileSecret);
        formData.append("response", turnstileToken as string);

        const result = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: formData,
          },
        );

        const outcome = await result.json();
        if (!outcome.success) {
          return {
            success: false,
            message:
              "Error de validación de seguridad (Turnstile). Por favor, intenta de nuevo.",
          };
        }
      } catch (error) {
        console.error("Turnstile verification error:", error);
        // Fallback: permitimos pasar si falla la verificación externa para no bloquear al usuario por errores de red,
        // pero en producción estricta podrías querer bloquearlo.
      }
    } else if (import.meta.env.PROD && !turnstileSecret) {
      console.warn("TURNSTILE_SECRET_KEY no está configurado en el entorno.");
    }

    // Simulación de envío de email
    // TODO: Integrar con un proveedor real de email (Resend, SendGrid, etc.)
    console.log(`📧 Nuevo mensaje de contacto:
    Nombre: ${data.nombre}
    Email: ${data.email}
    Asunto: ${data.asunto || "Sin asunto"}
    Mensaje: ${data.mensaje}
  `);

    // Simulamos un pequeño delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message:
        _`contact.successMessage` ||
        "¡Mensaje enviado con éxito! Te responderemos a la brevedad.",
    };
  },
  zod$({
    nombre: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    asunto: z.string().optional(),
    mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
    "cf-turnstile-response": z.string().optional(),
  }),
);

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
  const action = useSendContactEmail();
  const containerRef = useSignal<HTMLElement>();
  const turnstileToken = useSignal("");

  // Inicialización de Turnstile
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => containerRef.value);

    if (typeof window === "undefined" || !containerRef.value) return;

    const renderWidget = () => {
      if (window.turnstile) {
        // Limpiamos contenido previo porsiaca
        containerRef.value!.innerHTML = "";

        window.turnstile.render(containerRef.value!, {
          sitekey:
            import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ||
            "1x00000000000000000000AA", // Clave de prueba por defecto
          theme: "light",
          callback: function (token: string) {
            turnstileToken.value = token;
          },
          "expired-callback": function () {
            turnstileToken.value = "";
          },
        });
      }
    };

    if (!document.getElementById("turnstile-script")) {
      const script = document.createElement("script");
      script.id = "turnstile-script";
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }
  });

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
        <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <div class="mb-8">
              <h2 class="mb-4 text-3xl font-bold text-gray-800">{_`Envíanos un mensaje`}</h2>
              <p class="text-gray-600">
                {_`¿Tienes dudas, consultas o quieres comunicarte con nosotros? Completa el formulario y te responderemos a la brevedad.`}
              </p>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              {action.value?.success ? (
                <div class="animate-in fade-in zoom-in py-12 text-center duration-300">
                  <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <LuCheckCircle class="h-10 w-10" />
                  </div>
                  <h3 class="mb-3 text-2xl font-bold text-gray-800">
                    ¡Mensaje Enviado!
                  </h3>
                  <p class="mx-auto mb-8 max-w-md text-green-700">
                    {action.value.message}
                  </p>
                  <Button
                    variant="outline"
                    onClick$={() => window.location.reload()}
                    fullWidth
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <Form action={action} class="space-y-6">
                  {action.value?.message && !action.value.success && (
                    <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                      <LuAlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <p>{action.value.message}</p>
                    </div>
                  )}

                  <div>
                    <label
                      class="mb-2 block font-semibold text-gray-700"
                      for="nombre"
                    >
                      {_`Nombre y apellido`}
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-600 focus:outline-none"
                      placeholder="Juan Pérez"
                    />
                    {action.value?.fieldErrors?.nombre && (
                      <p class="mt-1 text-sm text-red-500">
                        {action.value.fieldErrors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      class="mb-2 block font-semibold text-gray-700"
                      for="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-600 focus:outline-none"
                      placeholder="tu@email.com"
                    />
                    {action.value?.fieldErrors?.email && (
                      <p class="mt-1 text-sm text-red-500">
                        {action.value.fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      class="mb-2 block font-semibold text-gray-700"
                      for="asunto"
                    >
                      {_`Asunto`}
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-600 focus:outline-none"
                      placeholder="Consulta sobre..."
                    />
                    {action.value?.fieldErrors?.asunto && (
                      <p class="mt-1 text-sm text-red-500">
                        {action.value.fieldErrors.asunto}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      class="mb-2 block font-semibold text-gray-700"
                      for="mensaje"
                    >
                      {_`Mensaje`}
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={6}
                      class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-600 focus:outline-none"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                    {action.value?.fieldErrors?.mensaje && (
                      <p class="mt-1 text-sm text-red-500">
                        {action.value.fieldErrors.mensaje}
                      </p>
                    )}
                  </div>

                  {/* Turnstile Widget Container */}
                  <div class="min-h-[65px]">
                    <div ref={containerRef}></div>
                  </div>
                  {/* Token enviado como campo oculto */}
                  <input
                    type="hidden"
                    name="cf-turnstile-response"
                    value={turnstileToken.value}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={
                      action.isRunning ||
                      (!turnstileToken.value && import.meta.env.PROD)
                    }
                    class="h-12 text-lg"
                  >
                    {action.isRunning ? "Enviando..." : _`Enviar mensaje`}
                  </Button>
                </Form>
              )}
            </div>
          </div>

          {/* Contact Info & Map */}
          <div class="space-y-8">
            {/* Contact Information Cards */}
            <div>
              <h2 class="mb-6 text-3xl font-bold text-gray-800">{_`Información de contacto`}</h2>

              <div class="space-y-4">
                {/* Address */}
                <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div class="flex items-start gap-4">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <LuMapPin class="h-6 w-6" />
                    </div>
                    <div>
                      <h3 class="mb-1 font-bold text-gray-900">{_`Dirección`}</h3>
                      <p class="text-gray-600">
                        Mutual Cultural Círculo Italiano Joven Italia
                      </p>
                      <p class="text-gray-600">Calle 24 n°1214, Miramar</p>
                      <p class="text-gray-600">Buenos Aires, Argentina</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div class="flex items-start gap-4">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <LuMail class="h-6 w-6" />
                    </div>
                    <div>
                      <h3 class="mb-1 font-bold text-gray-900">Email</h3>
                      <a
                        href="mailto:socios@italianosenmiramar.com"
                        class="font-medium text-green-700 hover:text-green-700 hover:underline"
                      >
                        socios@italianosenmiramar.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                  <div class="flex items-start gap-4">
                    <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <LuPhone class="h-6 w-6" />
                    </div>
                    <div>
                      <h3 class="mb-1 font-bold text-gray-900">{_`Teléfono`}</h3>
                      <a
                        href="tel:+542291433766"
                        class="font-medium text-green-700 hover:text-green-700 hover:underline"
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
              <h3 class="mb-4 text-2xl font-bold text-gray-800">{_`Cómo llegar`}</h3>
              <div class="h-[400px] overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d886.6801414036926!2d-57.83928588009304!3d-38.27163142202117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95851062f02a2eef%3A0xd4ffbfea83c5b8ab!2sMutual%20Cultural%2C%20Circulo%20Italiano%2C%20Joven%20Italia%20de%20Miramar!5e0!3m2!1ses!2sar!4v1764053973075!5m2!1ses!2sar"
                  width="600"
                  height="450"
                  style="border:0;"
                  allowFullscreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

export const onStaticGenerate = generateI18nPaths;
