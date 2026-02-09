import { component$ } from "@builder.io/qwik";
import { _ } from "compiled-i18n";
import {
  type DocumentHead,
  routeAction$,
  zod$,
  z,
  Form,
} from "@builder.io/qwik-city";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import { Select } from "~/components/ui/Select";
import { Card } from "~/components/ui/card/card";
import { Accordion } from "~/components/ui";
import {
  LuCalendarCheck,
  LuMapPin,
  LuUsers,
  LuCheckCircle,
  LuSend,
  LuUtensils,
  LuWifi,
  LuMusic,
  LuSnowflake,
  LuProjector,
  LuShieldCheck,
  LuClock,
  LuArmchair,
} from "@qwikest/icons/lucide";
import { tursoClient } from "~/utils/turso";

export const useRentHall = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = tursoClient(requestEvent);

      await db.execute({
        sql: `INSERT INTO reservas_salones (nombre, apellido, email, telefono, tipo_evento, salon, fecha_estimada, mensaje, estado) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
        args: [
          data.nombre,
          data.apellido,
          data.email,
          data.telefono,
          data.tipo_evento,
          data.salon,
          data.fecha_estimada,
          data.mensaje || null,
        ],
      });

      return {
        success: true,
        message:
          "¡Solicitud enviada! Te contactaremos a la brevedad para confirmar disponibilidad.",
      };
    } catch (e: any) {
      console.error("Error saving hall reservation:", e);
      return {
        success: false,
        message:
          "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.",
      };
    }
  },
  zod$({
    nombre: z.string().min(2, "El nombre es obligatorio"),
    apellido: z.string().min(2, "El apellido es obligatorio"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(8, "Teléfono inválido"),
    tipo_evento: z.string().min(1, "Selecciona un tipo de evento"),
    salon: z.string().min(1, "Selecciona un salón"),
    fecha_estimada: z.string().min(1, "Selecciona una fecha estimada"),
    mensaje: z.string().optional(),
  }),
);

export default component$(() => {
  const action = useRentHall();

  const hallOptions = [
    {
      label: 'Salón Principal "Michelangelo" (280 personas)',
      value: "michelangelo",
    },
    { label: 'Salón "Giuseppe Verdi" (90 personas)', value: "giuseppe_verdi" },
  ];

  const eventTypeOptions = [
    { label: "Cumpleaños / 15 Años", value: "cumpleanos" },
    { label: "Casamiento", value: "casamiento" },
    { label: "Evento Corporativo / Conferencia", value: "corporativo" },
    { label: "Reunión Familiar", value: "reunion" },
    { label: "Otro", value: "otro" },
  ];

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative z-10 container mx-auto px-4 py-24 text-center md:py-32">
          <h1 class="animate-in fade-in slide-in-from-bottom-6 mb-6 text-4xl leading-tight font-bold duration-700 md:text-6xl">
            Alquiler de Salones para Eventos en Miramar
          </h1>
          <p class="animate-in fade-in slide-in-from-bottom-8 mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-200 delay-200 duration-700 md:text-2xl">
            Espacios versátiles e históricos para que tu evento sea inolvidable.
            Bodas, conferencias y celebraciones en el corazón de Miramar.
          </p>
          <Button
            size="lg"
            class="animate-in fade-in zoom-in bg-blue-600 px-8 text-lg shadow-xl shadow-blue-900/20 delay-300 duration-700 hover:bg-blue-700"
            onClick$={() => {
              document
                .getElementById("booking-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Solicitar Presupuesto
          </Button>
        </div>
      </section>

      {/* Halls List Section */}
      <section class="container mx-auto px-4 py-20">
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Nuestros Espacios
          </h2>
          <div class="mx-auto mb-6 h-1 w-16 rounded-full bg-blue-600"></div>
          <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Contamos con opciones adaptadas a diferentes tipos de eventos y
            capacidades.
          </p>
        </div>

        <div class="mx-auto mb-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Salón 1 */}
          <Card.Root class="overflow-hidden border-blue-100 bg-white shadow-lg transition-shadow hover:shadow-xl">
            <div class="group relative h-48 overflow-hidden bg-gray-200">
              <img
                src="/images/salones/michelangelo.jpg"
                alt="Salón de fiestas Michelangelo en Miramar para bodas y conferencias"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <Card.Header>
              <Card.Title class="mb-2 text-2xl text-blue-900">
                Salón Principal "Michelangelo"
              </Card.Title>
              <Card.Description class="text-base">
                El escenario perfecto para grandes celebraciones. Ideal para fiestas de 15 en Miramar, casamientos grandes y eventos corporativos...
              </Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
              <div class="flex items-center text-gray-600">
                <LuUsers class="mr-3 h-5 w-5 text-blue-600" />
                <span class="font-medium">Capacidad hasta 280 personas</span>
              </div>
              <div class="flex items-center text-gray-600">
                <LuMapPin class="mr-3 h-5 w-5 text-blue-600" />
                <span>1er Piso - Accesible</span>
              </div>
              <p class="mt-4 leading-relaxed text-gray-600">
                Un salón histórico con amplios ventanales, luz natural y vistas
                a la ciudad. Ideal para casamientos, fiestas de 15, cenas show y
                conferencias.
              </p>
            </Card.Content>
          </Card.Root>

          {/* Salón 2 */}
          <Card.Root class="overflow-hidden border-blue-100 bg-white shadow-lg transition-shadow hover:shadow-xl">
            <div class="group relative h-48 overflow-hidden bg-gray-200">
              <img
                src="/images/salones/giuseppe.jpg"
                alt="Salón Giuseppe Verdi"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <Card.Header>
              <Card.Title class="mb-2 text-2xl text-blue-900">
                Salón "Giuseppe Verdi"
              </Card.Title>
              <Card.Description class="text-base">
                Intimidad y elegancia para eventos medianos.
              </Card.Description>
            </Card.Header>
            <Card.Content class="space-y-4">
              <div class="flex items-center text-gray-600">
                <LuUsers class="mr-3 h-5 w-5 text-blue-600" />
                <span class="font-medium">Capacidad hasta 90 personas</span>
              </div>
              <div class="flex items-center text-gray-600">
                <LuMapPin class="mr-3 h-5 w-5 text-blue-600" />
                <span>2do Piso</span>
              </div>
              <p class="mt-4 leading-relaxed text-gray-600">
                Espacio luminoso y versátil. Perfecto para conferencias, cursos,
                reuniones corporativas, cumpleaños infantiles o reuniones
                familiares privadas.
              </p>
            </Card.Content>
          </Card.Root>
        </div>
      </section>

      {/* Services Section */}
      <section class="bg-gray-50 py-20">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Servicios Incluidos y Adicionales
            </h2>
            <div class="mx-auto h-1 w-16 rounded-full bg-blue-600"></div>
            <p class="mt-4 text-lg text-gray-600">Todo lo que necesitas para que tu evento sea un éxito.</p>
          </div>

          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: LuUtensils, title: "Cocina Equipada", desc: "Instalaciones completas para catering." },
              { icon: LuWifi, title: "Conectividad Wi-Fi", desc: "Internet de alta velocidad disponible." },
              { icon: LuMusic, title: "Sonido Básico", desc: "Sistema de audio para música y voz." },
              { icon: LuSnowflake, title: "Climatización", desc: "Aire acondicionado y calefacción." },
              { icon: LuProjector, title: "Proyector", desc: "Proyector visual (consultar disponibilidad)." },
              { icon: LuShieldCheck, title: "Cobertura Médica", desc: "Área protegida para emergencias." },
              { icon: LuClock, title: "Horarios Flexibles", desc: "Adaptamos el alquiler a tus necesidades." },
              { icon: LuArmchair, title: "Mobiliario", desc: "Mesas y sillas incluidas." },
            ].map((service, index) => (
              <div key={index} class="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div class="p-3 mb-4 rounded-full bg-blue-50 text-blue-600">
                  <service.icon class="h-8 w-8" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p class="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section class="bg-white py-20">
        <div class="container mx-auto max-w-3xl px-4">
          <div class="mb-12 text-center">
            <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Preguntas Frecuentes
            </h2>
            <div class="mx-auto h-1 w-16 rounded-full bg-blue-600"></div>
          </div>

          <Accordion.Root class="w-full space-y-4">
            <Accordion.Item value="item-1">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿Cómo puedo reservar un salón?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                Puede realizar una reserva completando el formulario más abajo en esta página, llamándonos directamente o visitando nuestra secretaría. Le recomendamos reservar con al menos 2 meses de anticipación para asegurar la fecha deseada.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-2">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿Ofrecen servicio de catering?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                Contamos con una lista de proveedores de catering recomendados que conocen nuestras instalaciones, pero también puede traer su propio servicio de catering de confianza. Consulte por nuestras opciones de menú italiano tradicional si busca una experiencia temática.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-3">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿Qué instalaciones y equipamiento incluyen?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                Nuestros salones incluyen sistema de sonido básico (consultar alcance), mesas y sillas. Por un costo adicional o mediante proveedores externos, puede solicitar iluminación especial, decoración temática y equipamiento audiovisual avanzado.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-4">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿Se puede llevar catering externo?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                Sí, permitimos servicios de catering externos. Sin embargo, el proveedor debe coordinar previamente con nuestra administración para conocer las instalaciones de cocina y los requisitos de limpieza y orden.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-5">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿Hasta qué hora se puede alquilar?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                El horario límite para eventos nocturnos suele ser hasta las 5:00 AM, respetando las normativas municipales vigentes. Para eventos diurnos o corporativos, los horarios son flexibles según la necesidad.
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-6">
              <Accordion.Trigger class="text-lg font-medium text-gray-800 hover:text-blue-600">
                ¿El edificio cuenta con seguro/cobertura médica?
              </Accordion.Trigger>
              <Accordion.Content class="text-gray-600">
                Sí, el Círculo Italiano cuenta con seguro de responsabilidad civil y servicio de área protegida para emergencias médicas durante el desarrollo de los eventos dentro de nuestras instalaciones.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" class="relative bg-blue-900/5 py-20">
        <div class="container mx-auto max-w-3xl px-4">
          <Card.Root class="border-t-4 border-t-blue-600 shadow-2xl">
            <Card.Header class="text-center">
              <Card.Title class="text-3xl font-bold text-gray-800">
                Solicita tu Reserva
              </Card.Title>
              <Card.Description class="text-lg">
                Completa el formulario y verificaremos la disponibilidad para tu
                fecha.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              {action.value?.success ? (
                <div class="animate-in fade-in zoom-in py-12 text-center duration-300">
                  <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <LuCheckCircle class="h-10 w-10" />
                  </div>
                  <h3 class="mb-3 text-2xl font-bold text-green-800">
                    ¡Consulta Enviada!
                  </h3>
                  <p class="mx-auto mb-8 max-w-md text-green-700">
                    {action.value.message}
                  </p>
                  <Button
                    variant="outline"
                    onClick$={() => window.location.reload()}
                  >
                    Hacer otra consulta
                  </Button>
                </div>
              ) : (
                <Form action={action} class="space-y-6">
                  {action.value?.message && !action.value.success && (
                    <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                      {action.value.message}
                    </div>
                  )}

                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="nombre">Nombre</Label>
                      <Input
                        name="nombre"
                        id="nombre"
                        placeholder="Tu nombre"
                      />
                      {action.value?.fieldErrors?.nombre && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.nombre}
                        </p>
                      )}
                    </div>
                    <div class="space-y-2">
                      <Label for="apellido">Apellido</Label>
                      <Input
                        name="apellido"
                        id="apellido"
                        placeholder="Tu apellido"
                      />
                      {action.value?.fieldErrors?.apellido && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.apellido}
                        </p>
                      )}
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="email">Email</Label>
                      <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="email@ejemplo.com"
                      />
                      {action.value?.fieldErrors?.email && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div class="space-y-2">
                      <Label for="telefono">Teléfono / WhatsApp</Label>
                      <Input
                        name="telefono"
                        id="telefono"
                        type="tel"
                        placeholder="2291..."
                      />
                      {action.value?.fieldErrors?.telefono && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="salon">Salón de Interés</Label>
                      <Select
                        name="salon"
                        id="salon"
                        options={hallOptions}
                        placeholder="Selecciona un salón"
                      />
                      {action.value?.fieldErrors?.salon && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.salon}
                        </p>
                      )}
                    </div>
                    <div class="space-y-2">
                      <Label for="tipo_evento">Tipo de Evento</Label>
                      <Select
                        name="tipo_evento"
                        id="tipo_evento"
                        options={eventTypeOptions}
                        placeholder="Ej: Cumpleaños"
                      />
                      {action.value?.fieldErrors?.tipo_evento && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.tipo_evento}
                        </p>
                      )}
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="space-y-2">
                      <Label for="fecha_estimada">Fecha Estimada</Label>
                      <div class="relative">
                        <Input
                          name="fecha_estimada"
                          id="fecha_estimada"
                          type="date"
                          class="pl-10"
                        />
                        <LuCalendarCheck class="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                      </div>
                      {action.value?.fieldErrors?.fecha_estimada && (
                        <p class="text-xs text-red-600">
                          {action.value.fieldErrors.fecha_estimada}
                        </p>
                      )}
                    </div>
                    <div class="space-y-2">
                      {/* Empty placeholder to align grid if needed, or add more fields */}
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="mensaje">
                      Comentarios Adicionales (Opcional)
                    </Label>
                    <textarea
                      name="mensaje"
                      id="mensaje"
                      rows={3}
                      class="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Cuéntanos más sobre tu evento..."
                    />
                    {action.value?.fieldErrors?.mensaje && (
                      <p class="text-xs text-red-600">
                        {action.value.fieldErrors.mensaje}
                      </p>
                    )}
                  </div>

                  <div class="pt-4">
                    <div class="flex flex-col gap-4 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={action.isRunning}
                        class="h-12 flex-1 bg-blue-600 text-base hover:bg-blue-700"
                      >
                        {action.isRunning ? (
                          "Enviando Solicitud..."
                        ) : (
                          <>
                            {_`halls.bookBtn`} <LuSend class="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <a
                        href="https://wa.me/5492291514011"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-[#25D366] text-base font-medium text-white shadow-sm transition-colors hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
                      >
                        {_`halls.whatsappBtn`}
                      </a>
                    </div>
                  </div>
                </Form>
              )}
            </Card.Content>
          </Card.Root>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Alquiler de Salones en Miramar para Eventos y Fiestas | Círculo Italiano",
  meta: [
    {
      name: "description",
      content:
        "Alquiler de salones para eventos en Miramar. Salón Michelangelo y Giuseppe Verdi. Ideales para casamientos, conferencias y fiestas.",
    },
  ],
};
