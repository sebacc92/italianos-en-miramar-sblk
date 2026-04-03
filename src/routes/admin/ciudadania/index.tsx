import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { ciudadania } from "~/db/schema.server";
import { LuSave, LuLandmark } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Ciudadanía — Admin | Círculo Italiano",
};

export const useCiudadaniaLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(ciudadania).limit(1);
  return data.length > 0 ? data[0] : { id: "", dia_hora: "", nombre_asesora: "" };
});

export const useUpdateCiudadaniaAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    
    await db.delete(ciudadania);
    await db.insert(ciudadania).values({
      dia_hora: data.dia_hora,
      nombre_asesora: data.nombre_asesora,
    });

    return { success: true };
  },
  zod$({
    dia_hora: z.string().min(1, "Debes especificar el día y horario"),
    nombre_asesora: z.string().min(1, "Debes especificar el nombre de la asesora"),
  })
);

export default component$(() => {
  const compData = useCiudadaniaLoader();
  const updateAction = useUpdateCiudadaniaAction();

  return (
    <div class="mx-auto max-w-2xl">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Ciudadanía</h1>
        <p class="mt-1 text-sm text-gray-500">
          Configura los datos de atención de la asesora.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center gap-3">
           <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
             <LuLandmark class="h-5 w-5" />
           </div>
           <div>
             <h2 class="text-lg font-bold text-gray-900">Asesoramiento Consular</h2>
             <p class="text-xs text-gray-500">Impacta directamente en la página web pública.</p>
           </div>
        </div>
        
        <div class="mt-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
          <Form action={updateAction} class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Día y hora de la próxima visita de la asesora</label>
              <Input 
                name="dia_hora" 
                value={updateAction.formData?.get('dia_hora')?.toString() ?? compData.value.dia_hora} 
                placeholder="Ej: Todos los Jueves de 15:00 a 17:00 hs." 
                required 
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre completo de la asesora</label>
              <Input 
                name="nombre_asesora" 
                value={updateAction.formData?.get('nombre_asesora')?.toString() ?? compData.value.nombre_asesora} 
                placeholder="Ej: María Rossi" 
                required 
              />
            </div>
            
            <div class="flex justify-end gap-2 pt-2">
              <Button type="submit" disabled={updateAction.isRunning}>
                {updateAction.isRunning ? "Guardando..." : <><LuSave class="mr-2 h-4 w-4" /> Guardar Configuración</>}
              </Button>
            </div>
            {updateAction.value?.success && (
              <p class="text-sm text-green-600 font-semibold text-right mt-2">¡Configuración actualizada con éxito!</p>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
});
