import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { exposiciones } from "~/db/schema.server";
import { desc, eq } from "drizzle-orm";
import { LuPlus, LuTrash2, LuImagePlus, LuPalette } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Exposiciones — Admin | Círculo Italiano",
};

export const useExposicionesLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db.select().from(exposiciones).orderBy(desc(exposiciones.createdAt));
});

export const useCreateExposicionAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    await db.insert(exposiciones).values({
      titulo: data.titulo,
      fecha_inauguracion: data.fecha_inauguracion,
      nombre_artista: data.nombre_artista,
      contacto_artista: data.contacto_artista,
    });
    return { success: true };
  },
  zod$({
    titulo: z.string().min(1, "El título es obligatorio"),
    fecha_inauguracion: z.string().min(1, "La fecha es obligatoria"),
    nombre_artista: z.string().min(1, "El nombre del artista es obligatorio"),
    contacto_artista: z.string().min(1, "El contacto es obligatorio"),
  })
);

export const useDeleteExposicionAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.delete(exposiciones).where(eq(exposiciones.id, String(data.id)));
  return { success: true };
});

export default component$(() => {
  const data = useExposicionesLoader();
  const createAction = useCreateExposicionAction();
  const deleteAction = useDeleteExposicionAction();
  const showAddForm = useSignal(false);

  return (
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Salas de Exposiciones</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gestiona las exposiciones de arte y sus respectivas galerías de obras.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Exposiciones</h2>
          <Button
            variant="outline"
            onClick$={() => (showAddForm.value = !showAddForm.value)}
          >
            <LuPlus class="mr-2 h-4 w-4" />
            Nueva Exposición
          </Button>
        </div>

        {showAddForm.value && (
          <div class="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <Form action={createAction} class="space-y-4" onSubmitCompleted$={() => {
              if (createAction.value?.success) showAddForm.value = false;
            }}>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Título de la Exposición</label>
                  <Input name="titulo" placeholder="Ej: Renacimiento Moderno" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Artista</label>
                  <Input name="nombre_artista" placeholder="Nombre del artista" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Día/Fecha de Inauguración</label>
                  <Input name="fecha_inauguracion" placeholder="Ej: Viernes 20, 19hs" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Contacto Artista</label>
                  <Input name="contacto_artista" placeholder="Email o teléfono" required />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick$={() => (showAddForm.value = false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createAction.isRunning}>
                  {createAction.isRunning ? "Guardando..." : "Guardar Exposición"}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {data.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <LuPalette class="mb-3 h-10 w-10 text-gray-300" />
            <p>No hay exposiciones registradas.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Exposición</th>
                  <th class="px-4 py-3 font-semibold">Inauguración</th>
                  <th class="px-4 py-3 font-semibold">Contacto</th>
                  <th class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {data.value.map((expo) => (
                  <tr key={expo.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-4 py-3">
                      <div class="font-bold text-gray-900">{expo.titulo}</div>
                      <div class="text-xs text-gray-500">Artista: {expo.nombre_artista}</div>
                    </td>
                    <td class="px-4 py-3">
                      {expo.fecha_inauguracion}
                    </td>
                    <td class="px-4 py-3">
                      <div class="text-xs">{expo.contacto_artista}</div>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex justify-end gap-2 text-gray-400">
                        <a
                          href={`/admin/exposiciones/${expo.id}`}
                          class="inline-block rounded-md bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-900"
                          title="Gestionar Obras (Galería)"
                        >
                          <LuImagePlus class="h-4 w-4" />
                        </a>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar esta exposición? (Se borrarán todas sus obras)")) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={expo.id} />
                          <button
                            type="submit"
                            class="rounded-md p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Eliminar exposición"
                          >
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
