import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { autoridades } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuSave, LuArrowLeft } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Editar Autoridad — Admin | Círculo Italiano",
};

export const useAutoridadLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db
    .select()
    .from(autoridades)
    .where(eq(autoridades.id, requestEvent.params.id))
    .limit(1);

  if (!data || data.length === 0) {
    throw requestEvent.redirect(302, "/admin/autoridades");
  }
  return data[0];
});

export const useUpdateAutoridadAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    await db
      .update(autoridades)
      .set({
        nombre: data.nombre,
        cargo: data.cargo,
      })
      .where(eq(autoridades.id, requestEvent.params.id));

    throw requestEvent.redirect(302, "/admin/autoridades");
  },
  zod$({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    cargo: z.string().min(1, "El cargo es obligatorio"),
  })
);

export default component$(() => {
  const compData = useAutoridadLoader();
  const updateAction = useUpdateAutoridadAction();

  return (
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Editar Autoridad</h1>
          <p class="mt-1 text-sm text-gray-500">
            Modifica la autoridad '{compData.value.nombre}'.
          </p>
        </div>
        <a href="/admin/autoridades" class="text-indigo-600 hover:underline flex items-center">
          <LuArrowLeft class="mr-2 h-4 w-4" /> Volver
        </a>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Form action={updateAction} class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre</label>
              <Input name="nombre" value={compData.value.nombre} required />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Cargo</label>
              <Input name="cargo" value={compData.value.cargo} required />
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
