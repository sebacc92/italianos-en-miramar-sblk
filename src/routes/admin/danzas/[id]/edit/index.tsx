import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { danzasCronograma } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuSave, LuArrowLeft } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Editar Clase — Admin | Círculo Italiano",
};

export const useClaseLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db
    .select()
    .from(danzasCronograma)
    .where(eq(danzasCronograma.id, requestEvent.params.id))
    .limit(1);

  if (!data || data.length === 0) {
    throw requestEvent.redirect(302, "/admin/danzas");
  }
  return data[0];
});

export const useUpdateClaseAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    await db
      .update(danzasCronograma)
      .set({
        clase: data.clase,
        categoria: data.categoria,
        profesores: data.profesores,
        dia_semana: data.dia_semana,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        salon: Number(data.salon),
      })
      .where(eq(danzasCronograma.id, requestEvent.params.id));

    throw requestEvent.redirect(302, "/admin/danzas");
  },
  zod$({
    clase: z.string().min(1, "La clase es obligatoria"),
    categoria: z.string().min(1, "La categoría es obligatoria"),
    profesores: z.string().min(1, "Los profesores son obligatorios"),
    dia_semana: z.string().min(1, "El día es obligatorio"),
    hora_inicio: z.string().min(1, "Inicio es obligatorio"),
    hora_fin: z.string().min(1, "Fin es obligatorio"),
    salon: z.string().transform(v => parseInt(v)).refine(v => v === 1 || v === 2, "Salón inválido"),
  })
);

export default component$(() => {
  const clase = useClaseLoader();
  const updateAction = useUpdateClaseAction();

  return (
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Editar Clase</h1>
          <p class="mt-1 text-sm text-gray-500">
            Modifica la clase de '{clase.value.clase}'.
          </p>
        </div>
        <a href="/admin/danzas" class="text-indigo-600 hover:underline flex items-center">
          <LuArrowLeft class="mr-2 h-4 w-4" /> Volver
        </a>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Form action={updateAction} class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Clase</label>
              <Input name="clase" value={clase.value.clase} class="h-12 text-base" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Categoría</label>
              <Input name="categoria" value={clase.value.categoria} class="h-12 text-base" required />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-semibold text-gray-700">Profesores</label>
              <Input name="profesores" value={clase.value.profesores} class="h-12 text-base" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Día de la Semana</label>
              <select name="dia_semana" required class="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(dia => (
                  <option key={dia} value={dia} selected={clase.value.dia_semana === dia}>{dia}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Salón</label>
              <select name="salon" required class="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="1" selected={clase.value.salon === 1}>Salón 1</option>
                <option value="2" selected={clase.value.salon === 2}>Salón 2</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Inicio</label>
              <Input type="time" name="hora_inicio" value={clase.value.hora_inicio} class="h-12 text-base" required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Fin</label>
              <Input type="time" name="hora_fin" value={clase.value.hora_fin} class="h-12 text-base" required />
            </div>
          </div>
          
          <div class="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={updateAction.isRunning}>
              {updateAction.isRunning ? "Guardando..." : <><LuSave class="mr-2 h-4 w-4" /> Guardar Cambios</>}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
});
