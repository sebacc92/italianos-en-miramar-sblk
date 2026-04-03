import { component$, useSignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  routeAction$,
  zod$,
  z,
} from "@builder.io/qwik-city";
import { CourseList } from "~/components/idiomas/CourseList";
import { InscriptionForm } from "~/components/idiomas/InscriptionForm";
import { Button } from "~/components/ui/Button";
import { getDb } from "~/db/client.server";
import { courses } from "~/db/schema.server";
import { eq, asc } from "drizzle-orm";
// Este utils/turso sigue usándose para la InscriptionForm asumiendo que es legacy/otra app config,
// Si "tursoClient" usa env, asegurémonos que funciona
import { tursoClient } from "~/utils/turso.server";

export const useCourses = routeLoader$(async ({ params, env }) => {
  const db = getDb(env);
  const locale = params.locale || "es";

  try {
    const res = await db
      .select()
      .from(courses)
      .orderBy(asc(courses.displayOrder));

    return res;
  } catch (error) {
    console.error("Error fetching courses from DB:", error);
    return [];
  }
});

export const useSubmitInscription = routeAction$(
  async (data, requestEvent) => {
    try {
      // Usamos la utilidad centralizada heredada del lprc/script legacy
      const db = tursoClient(requestEvent);

      await db.execute({
        sql: "INSERT INTO preinscripciones (nombre, email, telefono, curso, estado) VALUES (?, ?, ?, ?, 'pendiente')",
        args: [data.name, data.email, data.phone, data.course],
      });

      return {
        success: true,
        message: "¡Gracias por inscribirte! Nos pondremos en contacto pronto.",
      };
    } catch (e: any) {
      console.error("Error saving inscription:", e);
      return {
        success: false,
        message:
          "Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
      };
    }
  },
  zod$({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido (mínimo 8 números)"),
    course: z.string().min(1, "Selecciona un curso"),
  }),
);

export default component$(() => {
  const action = useSubmitInscription();
  const cursos = useCourses();
  const selectedCourseId = useSignal("");
  const nameInputRef = useSignal<HTMLInputElement>();

  return (
    <div class="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Section */}
      <section class="relative overflow-hidden text-white">
        <div class="absolute inset-0 bg-[url('/images/exterior_institucion.webp')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="relative z-10 container mx-auto px-4 py-24 text-center md:py-32">
          <span class="animate-in fade-in slide-in-from-bottom-4 mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold tracking-wider backdrop-blur-sm duration-700">
            INSCRIPCIONES ABIERTAS
          </span>
          <h1 class="animate-in fade-in slide-in-from-bottom-6 mb-6 text-4xl leading-tight font-bold delay-100 duration-700 md:text-6xl">
            Ciclo Lectivo Marzo 2026
          </h1>
          <p class="animate-in fade-in slide-in-from-bottom-8 mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-200 delay-200 duration-700 md:text-2xl">
            Reserva tu lugar en nuestros cursos de italiano e inglés.
          </p>
          <Button
            size="lg"
            class="animate-in fade-in zoom-in px-8 text-lg shadow-xl shadow-green-900/20 delay-300 duration-700"
            onClick$={() => {
              document
                .getElementById("inscription-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Reservar mi lugar
          </Button>
        </div>

        {/* Decorative bottom curve */}
        <div class="absolute bottom-0 left-0 z-10 w-full overflow-hidden leading-none">
          <svg
            class="relative block h-12 w-full text-gray-50 md:h-24"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Courses Section */}
      <section class="container mx-auto px-4 py-20">
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Nuestra Propuesta Educativa
          </h2>
          <div class="mx-auto mb-6 h-1 w-16 rounded-full bg-green-600"></div>
          <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Cursos diseñados para todas las edades y niveles, con un enfoque
            práctico y cultural.
          </p>
        </div>

        <CourseList
          courses={cursos.value}
          selectedCourseId={selectedCourseId}
          nameInputRef={nameInputRef}
        />
      </section>

      {/* Inscription Form Section */}
      <section id="inscription-form" class="relative bg-white py-20">
        {/* Background decoration */}
        <div class="absolute inset-x-0 top-0 h-40 bg-gray-50"></div>

        <div class="relative z-10 container mx-auto px-4">
          <InscriptionForm
            action={action}
            courses={cursos.value}
            selectedCourseId={selectedCourseId}
            nameInputRef={nameInputRef}
          />
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Cursos de Idiomas - Círculo Italiano",
  meta: [
    {
      name: "description",
      content:
        "Inscripciones abiertas para cursos de Italiano e Inglés en Miramar. Ciclo lectivo Marzo 2026. Clases para niños y adultos.",
    },
  ],
};

