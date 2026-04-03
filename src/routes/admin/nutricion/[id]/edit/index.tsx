import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, z, zod$, type DocumentHead, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionProfesionales } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuArrowLeft } from "@qwikest/icons/lucide";
import { WysiwygEditor } from "~/components/admin/WysiwygEditor";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";

export const head: DocumentHead = {
  title: "Editar Nutricionista — Admin | Círculo Italiano",
};

export const useNutricionProfileLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = requestEvent.params.id;
  if (!id) throw requestEvent.redirect(302, "/admin/nutricion");

  const [prof] = await db.select().from(nutricionProfesionales).where(eq(nutricionProfesionales.id, id)).limit(1);
  if (!prof) throw requestEvent.redirect(302, "/admin/nutricion");
  return prof;
});

export const useUpdateProfAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    const id = requestEvent.params.id;
    if (!id) return requestEvent.fail(400, { error: "ID inválido" });

    await db.update(nutricionProfesionales).set({
      nombre: data.nombre,
      descripcion_servicios: data.descripcion_servicios,
      dia_semana: data.dia_semana,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
    }).where(eq(nutricionProfesionales.id, id));

    throw requestEvent.redirect(302, "/admin/nutricion");
  },
  zod$({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    dia_semana: z.string().min(1, "El día es obligatorio"),
    hora_inicio: z.string().min(1, "Inicio es obligatorio"),
    hora_fin: z.string().min(1, "Fin es obligatorio"),
    descripcion_servicios: z.string().min(1, "La descripción es obligatoria"),
  })
);

export default component$(() => {
  const profData = useNutricionProfileLoader();
  const updateAction = useUpdateProfAction();

  return (
    <div>
      <div class="mb-8 flex items-center gap-4">
        <Link
          href="/admin/nutricion"
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
        >
          <LuArrowLeft class="h-5 w-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-black text-gray-900">Editar Perfil de Nutrición</h1>
          <p class="mt-1 text-sm text-gray-500">
            Editando profesional: {profData.value.nombre}
          </p>
        </div>
      </div>

      <div class="max-w-3xl rounded-xl border border-gray-200 bg-white p-8">
        {updateAction.value?.error && (
          <div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {String(updateAction.value.error)}
          </div>
        )}
        
        <Form action={updateAction} class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre del Profesional</label>
              <Input name="nombre" value={profData.value.nombre} placeholder="Ej: Lic. María Silva" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Día de la Semana</label>
              <select name="dia_semana" value={profData.value.dia_semana} required class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="Lunes" selected={profData.value.dia_semana === "Lunes"}>Lunes</option>
                <option value="Martes" selected={profData.value.dia_semana === "Martes"}>Martes</option>
                <option value="Miércoles" selected={profData.value.dia_semana === "Miércoles"}>Miércoles</option>
                <option value="Jueves" selected={profData.value.dia_semana === "Jueves"}>Jueves</option>
                <option value="Viernes" selected={profData.value.dia_semana === "Viernes"}>Viernes</option>
                <option value="Sábado" selected={profData.value.dia_semana === "Sábado"}>Sábado</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Inicio</label>
              <Input type="time" name="hora_inicio" value={profData.value.hora_inicio} required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Fin</label>
              <Input type="time" name="hora_fin" value={profData.value.hora_fin} required />
            </div>
          </div>
          
          <div>
            <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción de Servicios</label>
            <p class="mb-2 text-xs text-gray-500">Esta es la presentación que verá el paciente en la vista web.</p>
            <WysiwygEditor name="descripcion_servicios" value={profData.value.descripcion_servicios || ""} />
          </div>

          <div class="flex items-center gap-3 border-t border-gray-100 pt-6 mt-6">
             <Button type="submit" disabled={updateAction.isRunning}>
                {updateAction.isRunning ? "Guardando..." : "Guardar Cambios"}
             </Button>
             <Link
               href="/admin/nutricion"
               class="text-sm text-gray-500 transition-colors hover:text-gray-700"
             >
               Cancelar
             </Link>
          </div>
        </Form>
      </div>
    </div>
  );
});
