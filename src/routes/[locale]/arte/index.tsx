import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { arteCursos } from "~/db/schema.server";
import { InscriptionForm } from "~/components/idiomas/InscriptionForm";
import { tursoClient } from "~/utils/turso.server";
import { LuPalette, LuClock } from "@qwikest/icons/lucide";

export const useArteData = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const talleres = await db.select().from(arteCursos);
  return talleres;
});

export const useSubmitArteInscription = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = tursoClient(requestEvent);
      // Append "Taller de Arte:" so admins know where it comes from
      const courseName = `Taller de Arte: ${data.course}`;

      await db.execute({
        sql: "INSERT INTO preinscripciones (nombre, email, telefono, curso, estado) VALUES (?, ?, ?, ?, 'pendiente')",
        args: [data.name, data.email, data.phone, courseName],
      });

      return {
        success: true,
        message: "¡Gracias por inscribirte al Taller de Arte! Nos pondremos en contacto pronto.",
      };
    } catch (e: any) {
      console.error("Error saving arte inscription:", e);
      return {
        success: false,
        message: "Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.",
      };
    }
  },
  zod$({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido (mínimo 8 números)"),
    course: z.string().min(1, "Selecciona un taller"),
  })
);

export default component$(() => {
  const data = useArteData();
  const action = useSubmitArteInscription();

  // Mapear los datos de arte_cursos a la estructura que espera el InscriptionForm (reutilizando el form de idiomas)
  const formCourses = data.value.map(curso => ({
    id: curso.nombre, // We use name directly as ID to insert it as text
    nombre_curso: curso.nombre,
    horarios: `${curso.dia_semana} de ${curso.hora_inicio} a ${curso.hora_fin}`,
  }));

  return (
    <div class="flex min-h-screen flex-col bg-[#FDFBF7]">
      {/* Hero */}
      <section class="bg-linear-to-br from-orange-400 via-red-400 to-pink-500 py-24 text-white shadow-inner">
        <div class="container mx-auto px-4 text-center">
          <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg rotate-3 hover:rotate-6 transition-transform">
            <LuPalette class="h-12 w-12 text-white" />
          </div>
          <h1 class="mb-5 text-4xl font-extrabold md:text-6xl tracking-tight">Taller de Arte</h1>
          <p class="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed font-medium">
            Despertá tu creatividad. Vení a aprender, pintar y crear en un ambiente lleno de color y amistad.
          </p>
        </div>
      </section>

      {/* Talleres */}
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="mb-14 text-center">
            <h2 class="text-3xl font-bold text-gray-800">Nuestros Talleres</h2>
            <div class="mx-auto mt-4 h-1 w-20 rounded-full bg-orange-400"></div>
          </div>

          {data.value.length === 0 ? (
            <div class="text-center text-gray-500 py-10">
              <p>Próximamente publicaremos los nuevos horarios.</p>
            </div>
          ) : (
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2 lg:mx-20">
              {data.value.map((taller) => (
                <div key={taller.id} class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                  <div class="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-orange-100 opacity-50 transition-transform group-hover:scale-150"></div>
                  
                  <h3 class="relative z-10 mb-3 text-2xl font-bold text-gray-800">{taller.nombre}</h3>
                  <div class="relative z-10 mb-6 flex items-center text-orange-600 font-semibold bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100">
                    <LuClock class="mr-2 h-4 w-4" />
                    <span>{taller.dia_semana} de {taller.hora_inicio} a {taller.hora_fin}</span>
                  </div>
                  <p class="relative z-10 text-gray-600 leading-relaxed">
                    {taller.descripcion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inscripción */}
      {data.value.length > 0 && (
        <section class="relative py-20 bg-white">
          <div class="absolute inset-x-0 top-0 h-40 bg-[#FDFBF7]"></div>
          <div class="relative z-10 container mx-auto px-4">
            <InscriptionForm action={action} courses={formCourses as any} />
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Taller de Arte - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Taller de Arte en el Círculo Italiano de Miramar. Clases de pintura y dibujo.",
    },
  ],
};
