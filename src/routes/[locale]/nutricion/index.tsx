import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionProfesionales } from "~/db/schema.server";
import { TurnoForm } from "~/components/nutricion/TurnoForm";
import { tursoClient } from "~/utils/turso.server";
import { LuApple, LuClock, LuCheckCircle2 } from "@qwikest/icons/lucide";

export const useNutricionData = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(nutricionProfesionales);
  return data;
});

export const useSubmitTurnoAction = routeAction$(
  async (data, requestEvent) => {
    try {
      const db = tursoClient(requestEvent);
      // Extraemos el nombre del profesional desde la id de nutricionProfesionales
      const profId = String(data.course);
      
      const res = await db.execute({
        sql: "SELECT nombre FROM nutricion_profesionales WHERE id = ?",
        args: [profId],
      });
      const profName = res.rows[0]?.nombre || profId;
      
      const motifName = `Turno Nutrición: ${profName}`;

      await db.execute({
        sql: "INSERT INTO preinscripciones (nombre, email, telefono, curso, estado) VALUES (?, ?, ?, ?, 'pendiente')",
        args: [String(data.name), String(data.email), String(data.phone), motifName],
      });

      return {
        success: true,
        message: "¡Turno solicitado! El profesional se pondrá en contacto pronto.",
      };
    } catch (e: any) {
      console.error("Error saving turno:", e);
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
    course: z.string().min(1, "Selecciona un profesional"),
  })
);

export default component$(() => {
  const data = useNutricionData();
  const action = useSubmitTurnoAction();

  return (
    <div class="flex min-h-screen flex-col bg-green-50/30">
      {/* Hero */}
      <section class="bg-linear-to-br from-green-800 via-green-700 to-emerald-700 py-24 text-white shadow-inner">
        <div class="container mx-auto px-4 text-center">
          <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
            <LuApple class="h-12 w-12 text-white" />
          </div>
          <h1 class="mb-5 text-4xl font-extrabold md:text-6xl tracking-tight">Gabinete de Nutrición</h1>
          <p class="mx-auto max-w-2xl text-xl text-green-100 leading-relaxed font-medium">
            Profesionales al servicio de tu bienestar y rendimiento físico. Conseguí tus objetivos con asesoramiento personalizado.
          </p>
        </div>
      </section>

      {/* Profesionales */}
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="mb-14 text-center">
            <h2 class="text-3xl font-bold text-gray-800">Nuestros Profesionales</h2>
            <div class="mx-auto mt-4 h-1 w-20 rounded-full bg-green-500"></div>
          </div>

          {data.value.length === 0 ? (
            <div class="text-center text-gray-500 py-10">
              <p>Próximamente publicaremos el listado de profesionales.</p>
            </div>
          ) : (
            <div class="grid gap-8 md:grid-cols-2 lg:mx-20">
              {data.value.map((prof) => (
                <div key={prof.id} class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md border border-green-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <h3 class="mb-3 text-2xl font-bold text-green-900">{prof.nombre}</h3>
                  <div class="mb-5 flex items-center text-green-700 font-semibold bg-green-50 w-fit px-3 py-1.5 rounded-lg border border-green-200">
                    <LuClock class="mr-2 h-4 w-4" />
                    <span>{prof.dia_semana} ({prof.hora_inicio} a {prof.hora_fin}hs)</span>
                  </div>
                  
                  <div class="space-y-2 text-gray-600">
                    {prof.descripcion_servicios.split('\n').filter(s => s.trim().length > 0).map((s, i) => (
                      <div key={i} class="flex items-start">
                        <LuCheckCircle2 class="mr-2 mt-1 h-4 w-4 text-green-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Solicitar Turno */}
      {data.value.length > 0 && (
        <section class="relative py-20 bg-white border-t border-green-100">
          <div class="absolute inset-x-0 top-0 h-40 bg-green-50/30"></div>
          <div class="relative z-10 container mx-auto px-4">
            <TurnoForm action={action} profesionales={data.value as any} />
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Nutrición - Círculo Italiano",
  meta: [
    {
      name: "description",
      content: "Gabinete de Nutrición en el Círculo Italiano de Miramar. Evaluaciones y planes de alimentación.",
    },
  ],
};
