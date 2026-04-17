import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { autoridades } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuPlus, LuTrash2, LuUsers } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Autoridades — Admin | Círculo Italiano",
};

export const useAutoridadesLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(autoridades);
  return data;
});

export const useCreateAutoridadAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.insert(autoridades).values({
    nombre: data.nombre,
    cargo: data.cargo,
  });
  return { success: true };
}, zod$({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  cargo: z.string().min(1, "El cargo es obligatorio"),
}));

export const useDeleteAutoridadAction = routeAction$(async (data, requestEvent) => {
  const id = String(data.id);
  if (!id) return requestEvent.fail(400, { error: "ID inválido" });
  
  const db = getDb(requestEvent.env);
  await db.delete(autoridades).where(eq(autoridades.id, id));
  return { success: true };
});

export default component$(() => {
  const data = useAutoridadesLoader();
  const createAction = useCreateAutoridadAction();
  const deleteAction = useDeleteAutoridadAction();
  const showAddForm = useSignal(false);

  return (
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Autoridades</h1>
        <p class="mt-1 text-sm text-gray-500">
          Administición de los miembros y autoridades de la institución.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Nómina Actual</h2>
          <Button variant="outline" onClick$={() => (showAddForm.value = !showAddForm.value)}>
            <LuPlus class="mr-2 h-4 w-4" /> Agregar Autoridad
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
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre</label>
                  <Input name="nombre" placeholder="Ej: Dr. Fernando Pérez" required />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Cargo</label>
                  <Input name="cargo" placeholder="Ej: Presidente" required />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick$={() => (showAddForm.value = false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createAction.isRunning}>
                  {createAction.isRunning ? "Guardando..." : "Guardar Autoridad"}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {data.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <LuUsers class="mb-3 h-10 w-10 text-gray-300" />
            <p>No hay autoridades registradas</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            {/* Desktop Table */}
            <table class="hidden w-full text-left text-sm text-gray-600 md:table">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Autoridad</th>
                  <th class="px-4 py-3 font-semibold">Cargo</th>
                  <th class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {data.value.map((auth) => (
                  <tr key={auth.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-4 py-3 font-bold text-gray-900">{auth.nombre}</td>
                    <td class="px-4 py-3">{auth.cargo}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex justify-end gap-2 text-gray-400">
                        <a
                          href={`/admin/autoridades/${auth.id}/edit`}
                          class="inline-block rounded-md p-1.5 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </a>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro de remover a este integrante?")) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={auth.id} />
                          <button
                            type="submit"
                            class="rounded-md p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
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

            {/* Mobile Cards */}
            <div class="grid grid-cols-1 divide-y divide-gray-100 md:hidden">
              {data.value.map((auth) => (
                <div key={auth.id} class="p-4 space-y-3">
                  <div class="flex items-center justify-between gap-4">
                     <div class="min-w-0">
                       <h4 class="font-bold text-gray-900">{auth.nombre}</h4>
                       <p class="text-xs text-gray-500 uppercase tracking-wider">{auth.cargo}</p>
                     </div>
                     <div class="flex shrink-0 gap-2">
                        <a
                          href={`/admin/autoridades/${auth.id}/edit`}
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-600 active:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </a>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro de remover a este integrante?")) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={auth.id} />
                          <button
                            type="submit"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 active:bg-red-100"
                          >
                            <LuTrash2 class="h-4 w-4" />
                          </button>
                        </Form>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
