import { component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { nutricionConfig, nutricionHorarios } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { LuPlus, LuTrash2, LuClock, LuUser, LuPencil, LuImage, LuSettings } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { WysiwygEditor } from "~/components/admin/WysiwygEditor";
import { ImageUploader } from "~/components/ui/ImageUploader";

export const head: DocumentHead = {
  title: "Nutrición — Admin | Círculo Italiano",
};

export const useNutricionLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const [config] = await db.select().from(nutricionConfig).limit(1);
  const horarios = await db.select().from(nutricionHorarios);
  return { config: config || null, horarios };
});

export const useUpdateConfigAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const [existingConfig] = await db.select().from(nutricionConfig).limit(1);
  
  const values = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    heroTitle: data.heroTitle || null,
    heroDescription: data.heroDescription || null,
    heroImageUrl: data.heroImageUrl || null,
  };

  if (existingConfig) {
    await db.update(nutricionConfig).set(values).where(eq(nutricionConfig.id, existingConfig.id));
  } else {
    await db.insert(nutricionConfig).values(values);
  }
  return { success: true };
}, zod$({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
}));

export const useCreateHorarioAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.insert(nutricionHorarios).values({
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  });
  return { success: true };
}, zod$({
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
}));

export const useUpdateHorarioAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = String(data.id);
  if (!id) return requestEvent.fail(400, { error: "ID inválido" });
  await db.update(nutricionHorarios).set({
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  }).where(eq(nutricionHorarios.id, id));
  return { success: true };
}, zod$({
  id: z.string().min(1),
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
}));

export const useDeleteHorarioAction = routeAction$(async (data, requestEvent) => {
  const id = String(data.id);
  if (!id) return requestEvent.fail(400, { error: "ID inválido" });
  
  const db = getDb(requestEvent.env);
  await db.delete(nutricionHorarios).where(eq(nutricionHorarios.id, id));
  return { success: true };
});

export default component$(() => {
  const data = useNutricionLoader();
  const updateConfigAction = useUpdateConfigAction();
  const createHorarioAction = useCreateHorarioAction();
  const updateHorarioAction = useUpdateHorarioAction();
  const deleteHorarioAction = useDeleteHorarioAction();
  const showAddHorarioForm = useSignal(false);
  const editingHorario = useSignal<any>(null);
  const heroImageUrlSig = useSignal<string>(data.value.config?.heroImageUrl || "");

  return (
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Nutrición</h1>
        <p class="mt-1 text-sm text-gray-500">
          Administra el perfil y los horarios de la profesional de nutrición.
        </p>
      </div>

      {/* SECTION 1: CONFIGURACIÓN GENERAL Y HERO */}
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center gap-3">
          <div class="rounded-lg bg-green-100 p-2 text-green-700">
             <LuSettings class="h-6 w-6" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Configuración General y Hero</h2>
        </div>

        {updateConfigAction.value?.success && (
          <div class="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
            Configuración actualizada con éxito.
          </div>
        )}

        <Form action={updateConfigAction} class="space-y-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Perfil */}
            <div class="space-y-6">
              <div class="flex items-center gap-2 text-green-800 font-bold border-b border-green-50 pb-2">
                <LuUser class="h-5 w-5" />
                <h3>Perfil Profesional</h3>
              </div>
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre de la Profesional</label>
                <Input name="nombre" value={data.value.config?.nombre || ""} placeholder="Ej: Lic. María Silva" required />
              </div>
              
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción y Servicios</label>
                <p class="mb-2 text-xs text-gray-500">Esta presentación la verán los pacientes en la sección inferior.</p>
                <WysiwygEditor name="descripcion" value={data.value.config?.descripcion || ""} />
              </div>
            </div>

            {/* Hero y Foto */}
            <div class="space-y-6">
              <div class="flex items-center gap-2 text-indigo-800 font-bold border-b border-indigo-50 pb-2">
                <LuImage class="h-5 w-5" />
                <h3>Configuración Visual (Hero y Foto)</h3>
              </div>
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Título del Banner</label>
                <Input name="heroTitle" value={data.value.config?.heroTitle || ""} placeholder="Ej: Gabinete de Nutrición" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción del Banner</label>
                <Input name="heroDescription" value={data.value.config?.heroDescription || ""} placeholder="Ej: Atención profesional..." />
              </div>
              <div class="pt-2">
                <input type="hidden" name="heroImageUrl" value={heroImageUrlSig.value} />
                <ImageUploader
                  label="Foto de Perfil Profesional"
                  currentImageUrl={data.value.config?.heroImageUrl || undefined}
                  onUploadCompleted$={(url) => {
                    heroImageUrlSig.value = url;
                  }}
                />
                <p class="mt-2 text-xs text-gray-400 italic">
                  Esta foto se mostrará en formato circular arriba del nombre de la profesional.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end border-t border-gray-100 pt-6">
             <Button type="submit" disabled={updateConfigAction.isRunning} class="min-w-[200px]">
                {updateConfigAction.isRunning ? "Guardando..." : "Guardar Cambios"}
             </Button>
          </div>
        </Form>
      </div>

      {/* SECTION 2: HORARIOS */}
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-blue-100 p-2 text-blue-700">
              <LuClock class="h-6 w-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">Horarios de Atención</h2>
          </div>
          <Button variant="outline" onClick$={() => {
            editingHorario.value = null;
            showAddHorarioForm.value = !showAddHorarioForm.value;
          }}>
            <LuPlus class="mr-2 h-4 w-4" /> Agregar Horario
          </Button>
        </div>

        {(showAddHorarioForm.value || editingHorario.value) && (
          <div class="mb-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-800">
                {editingHorario.value ? "Editar Horario" : "Nuevo Horario"}
              </h3>
            </div>
            <Form 
              action={(editingHorario.value ? updateHorarioAction : createHorarioAction) as any} 
              class="space-y-4" 
              onSubmitCompleted$={() => {
                if (createHorarioAction.value?.success || updateHorarioAction.value?.success) {
                  showAddHorarioForm.value = false;
                  editingHorario.value = null;
                }
              }}
            >
              {editingHorario.value && <input type="hidden" name="id" value={editingHorario.value.id} />}
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Día de la Semana</label>
                  <select name="dia_semana" required class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="Lunes" selected={editingHorario.value?.dia_semana === "Lunes"}>Lunes</option>
                    <option value="Martes" selected={editingHorario.value?.dia_semana === "Martes"}>Martes</option>
                    <option value="Miércoles" selected={editingHorario.value?.dia_semana === "Miércoles"}>Miércoles</option>
                    <option value="Jueves" selected={editingHorario.value?.dia_semana === "Jueves"}>Jueves</option>
                    <option value="Viernes" selected={editingHorario.value?.dia_semana === "Viernes"}>Viernes</option>
                    <option value="Sábado" selected={editingHorario.value?.dia_semana === "Sábado"}>Sábado</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Inicio</label>
                  <Input type="time" name="hora_inicio" required value={editingHorario.value?.hora_inicio || ""} />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Fin</label>
                  <Input type="time" name="hora_fin" required value={editingHorario.value?.hora_fin || ""} />
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick$={() => {
                  showAddHorarioForm.value = false;
                  editingHorario.value = null;
                }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createHorarioAction.isRunning || updateHorarioAction.isRunning}>
                  {(createHorarioAction.isRunning || updateHorarioAction.isRunning) ? "Guardando..." : "Guardar Horario"}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {data.value.horarios.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <LuClock class="mb-3 h-10 w-10 text-gray-300" />
            <p>No hay franjas horarias cargadas todavía.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Día de la Semana</th>
                  <th class="px-4 py-3 font-semibold">Rango Horario</th>
                  <th class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {data.value.horarios.map((horario) => (
                  <tr key={horario.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-4 py-3 font-bold text-gray-900">{horario.dia_semana}</td>
                    <td class="px-4 py-3">{horario.hora_inicio} a {horario.hora_fin} hs</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                          title="Editar horario"
                          onClick$={() => {
                            editingHorario.value = horario;
                            showAddHorarioForm.value = true;
                          }}
                        >
                          <LuPencil class="h-4 w-4" />
                        </button>
                        <Form
                          action={deleteHorarioAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar este horario?")) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={horario.id} />
                          <button type="submit" class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Eliminar horario">
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
