import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionProfesionales } from "~/db/schema.server";
import { TurnoForm } from "~/components/nutricion/TurnoForm";
import { tursoClient } from "~/utils/turso.server";
import { LuClock, LuCheckCircle2 } from "@qwikest/icons/lucide";
import { PageHero } from "~/components/ui/PageHero";

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

  const groupedProfesionales = data.value.reduce((acc, prof) => {
    if (!acc[prof.nombre]) {
      acc[prof.nombre] = {
         id: prof.id,
         nombre: prof.nombre,
         descripcion_servicios: prof.descripcion_servicios,
         horarios: []
      };
    }
    acc[prof.nombre].horarios.push(`${prof.dia_semana} (${prof.hora_inicio} a ${prof.hora_fin}hs)`);
    return acc;
  }, {} as Record<string, { id: string, nombre: string, descripcion_servicios: string, horarios: string[] }>);

  const profesionalesArray = Object.values(groupedProfesionales);

  return (
    <div class="flex min-h-screen flex-col bg-green-50/30">
      {/* Hero */}
      <PageHero
        title="Gabinete de Nutrición"
        description="Profesionales al servicio de tu bienestar y rendimiento físico. Conseguí tus objetivos con asesoramiento personalizado."
      />

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
              {profesionalesArray.map((prof) => (
                <div key={prof.id} class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md border border-green-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <h3 class="mb-4 text-2xl font-bold text-green-900">{prof.nombre}</h3>
                  
                  <div class="mb-5 flex flex-wrap gap-2">
                    {prof.horarios.map((horario, i) => (
                      <div key={i} class="flex items-center text-green-800 font-semibold bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-sm">
                        <LuClock class="mr-2 h-4 w-4" />
                        <span>{horario}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div class="prose prose-sm prose-green max-w-none text-gray-600" dangerouslySetInnerHTML={prof.descripcion_servicios} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Solicitar Turno */}
      {profesionalesArray.length > 0 && (
        <section class="relative py-20 bg-white border-t border-green-100">
          <div class="absolute inset-x-0 top-0 h-40 bg-green-50/30"></div>
          <div class="relative z-10 container mx-auto px-4">
            {/* Usamos data.value para el TurnoForm o profesionalesArray. data.value tiene las IDS reales si las necesita.
                Pero profId era data.course. En profesionalesArray tenemos ids y nombres agrupados. */}
            <TurnoForm action={action} profesionales={profesionalesArray as any} />
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
