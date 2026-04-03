import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionProfesionales } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuPlus, LuTrash2, LuApple, LuPencil } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Nutrición — Admin | Círculo Italiano",
};

export const useNutricionLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(nutricionProfesionales);
  return data;
});

export const useCreateProfAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.insert(nutricionProfesionales).values({
    nombre: data.nombre,
    descripcion_servicios: data.descripcion_servicios,
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  });
  return { success: true };
}, zod$({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion_servicios: z.string().min(1, "La descripción es obligatoria"),
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
}));

export const useDeleteProfAction = routeAction$(async (data, requestEvent) => {
  const id = String(data.id);
  if (!id) return requestEvent.fail(400, { error: "ID inválido" });
  
  const db = getDb(requestEvent.env);
  await db.delete(nutricionProfesionales).where(eq(nutricionProfesionales.id, id));
  return { success: true };
});

export default component$(() => {
  const data = useNutricionLoader();
  const createAction = useCreateProfAction();
  const deleteAction = useDeleteProfAction();
  const showAddForm = useSignal(false);

  return (
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Nutrición</h1>
        <p class="mt-1 text-sm text-gray-500">
          Administra el personal del área de nutrición.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Profesionales</h2>
          <Button variant="outline" onClick$={() => (showAddForm.value = !showAddForm.value)}>
            <LuPlus class="mr-2 h-4 w-4" /> Nuevo Profesional
          </Button>
        </div>

        {showAddForm.value && (
          <div class="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <Form action={createAction} class="space-y-4" onSubmitCompleted$={() => {
              if (createAction.value?.success) {
                showAddForm.value = false;
              }
            }}>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre del Profesional</label>
                  <Input name="nombre" placeholder="Ej: Lic. María Silva" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Día de la Semana</label>
                  <select name="dia_semana" required class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Inicio</label>
                  <Input type="time" name="hora_inicio" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Fin</label>
                  <Input type="time" name="hora_fin" required />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción de Servicios</label>
                  <Input name="descripcion_servicios" placeholder="Ej: Nutrición deportiva, Evaluación antropométrica..." required />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick$={() => (showAddForm.value = false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createAction.isRunning}>
                  {createAction.isRunning ? "Guardando..." : "Guardar Profesional"}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {data.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <LuApple class="mb-3 h-10 w-10 text-gray-300" />
            <p>No hay profesionales cargados</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Profesional</th>
                  <th class="px-4 py-3 font-semibold">Horario</th>
                  <th class="px-4 py-3 font-semibold">Servicios</th>
                  <th class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {data.value.map((prof) => (
                  <tr key={prof.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-4 py-3 font-bold text-gray-900">{prof.nombre}</td>
                    <td class="px-4 py-3">{prof.dia_semana} ({prof.hora_inicio} a {prof.hora_fin})</td>
                    <td class="px-4 py-3 truncate max-w-xs">{prof.descripcion_servicios}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/nutricion/${prof.id}/edit`}
                          class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                          title="Editar profesional"
                        >
                          <LuPencil class="h-4 w-4" />
                        </a>
                        <Form
                        action={deleteAction}
                        onSubmit$={(e: Event) => {
                          if (!window.confirm("¿Seguro que deseas eliminar a este profesional?")) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="id" value={prof.id} />
                        <button type="submit" class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600">
                          <LuTrash2 class="h-4 w-4" />
                        </button>
                      </Form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});
