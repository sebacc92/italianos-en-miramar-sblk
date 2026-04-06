import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, z, zod$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { danzasCronograma, danzasGaleria, danzasConfig } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { LuPlus, LuTrash2, LuMusic } from "@qwikest/icons/lucide";
import { MultiImageUploader } from "~/components/admin/MultiImageUploader";
import { PdfUploader } from "~/components/admin/PdfUploader";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

export const head: DocumentHead = {
  title: "Danzas — Admin | Círculo Italiano",
};

export const useDanzasLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const schedule = await db.select().from(danzasCronograma).orderBy(desc(danzasCronograma.id));
  const galleryRaw = await db.select().from(danzasGaleria).orderBy(desc(danzasGaleria.createdAt));
  const galleryUrls = galleryRaw.map((g) => g.imageUrl);
  
  const configRaw = await db.select().from(danzasConfig).limit(1);
  const config = configRaw.length > 0 ? configRaw[0] : null;
  
  return { schedule, galleryUrls, config };
});

export const useCreateClassAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.insert(danzasCronograma).values({
    clase: data.clase,
    categoria: data.categoria,
    profesores: data.profesores,
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
    salon: Number(data.salon),
  });
  return { success: true };
}, zod$({
  clase: z.string().min(1, "La clase es obligatoria"),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  profesores: z.string().min(1, "Los profesores son obligatorios"),
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
  salon: z.string().transform(v => parseInt(v)).refine(v => v === 1 || v === 2, "Salón inválido"),
}));

export const useDeleteClassAction = routeAction$(async (data, requestEvent) => {
  const id = String(data.id);
  if (!id) return requestEvent.fail(400, { error: "ID inválido" });
  
  const db = getDb(requestEvent.env);
  await db.delete(danzasCronograma).where(eq(danzasCronograma.id, id));
  return { success: true };
});

export const useUpdateGalleryAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  
  let urls: string[] = [];
  try {
    urls = JSON.parse(data.urls as string);
  } catch (e) {
    return requestEvent.fail(400, { error: "URLs inválidas" });
  }

  // Transaction-like approach: remove all and insert new
  await db.delete(danzasGaleria);
  
  if (urls.length > 0) {
    const values = urls.map(url => ({ imageUrl: url }));
    await db.insert(danzasGaleria).values(values);
  }
  
  return { success: true };
});

export const useUpdateConfigAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const [existingConfig] = await db.select().from(danzasConfig).limit(1);
  
  const values = {
    pdf_url: data.pdf_url || (existingConfig?.pdf_url || ""),
    heroTitle: data.heroTitle || null,
    heroDescription: data.heroDescription || null,
  };

  if (existingConfig) {
    await db.update(danzasConfig).set(values).where(eq(danzasConfig.id, existingConfig.id));
  } else {
    // If no existing config, and no pdf_url provided, we need a default empty string for pdf_url as it might be NOT NULL
    await db.insert(danzasConfig).values({
      ...values,
      pdf_url: values.pdf_url || ""
    });
  }
  return { success: true };
}, zod$({
  pdf_url: z.string().optional(),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
}));

export default component$(() => {
  const data = useDanzasLoader();
  const createAction = useCreateClassAction();
  const deleteAction = useDeleteClassAction();
  const updateGalleryAction = useUpdateGalleryAction();
  const updateConfigAction = useUpdateConfigAction();
  
  const showAddForm = useSignal(false);

  return (
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Escuela de Danzas</h1>
        <p class="mt-1 text-sm text-gray-500">
          Administra el cronograma de clases y la galería de fotos.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Cronograma Section */}
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Cronograma</h2>
            <Button
              variant="outline"
              onClick$={() => (showAddForm.value = !showAddForm.value)}
            >
              <LuPlus class="mr-2 h-4 w-4" />
              Nueva Clase
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
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Clase (Ej: Ritmos)</label>
                    <Input name="clase" class="h-12 text-base" placeholder="Ej: Urbano" required />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Categoría</label>
                    <Input name="categoria" class="h-12 text-base" placeholder="Ej: JUVENIL 3" required />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Profesores</label>
                    <Input name="profesores" class="h-12 text-base" placeholder="Ej: Candela, Paz" required />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Día de la Semana</label>
                    <select name="dia_semana" required class="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Salón</label>
                    <select name="salon" required class="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="1">Salón 1</option>
                      <option value="2">Salón 2</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Inicio</label>
                    <Input type="time" name="hora_inicio" class="h-12 text-base" required />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-semibold text-gray-700">Hora Fin</label>
                    <Input type="time" name="hora_fin" class="h-12 text-base" required />
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick$={() => (showAddForm.value = false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createAction.isRunning}>
                    {createAction.isRunning ? "Guardando..." : "Guardar Clase"}
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {data.value.schedule.length === 0 ? (
            <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <LuMusic class="mb-3 h-10 w-10 text-gray-300" />
              <p>No hay clases configuradas</p>
            </div>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full text-left text-base text-gray-600">
                <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th class="px-4 py-4 font-semibold">Clase / Cat.</th>
                    <th class="px-4 py-4 font-semibold">Día / Hora</th>
                    <th class="px-4 py-4 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {data.value.schedule.map((clase) => (
                    <tr key={clase.id} class="transition-colors hover:bg-gray-50">
                      <td class="px-4 py-4">
                        <div class="font-bold text-gray-900">{clase.clase} - {clase.categoria}</div>
                        <div class="text-sm text-gray-500 mt-1">Prof: {clase.profesores}</div>
                      </td>
                      <td class="px-4 py-4">
                        <div class="font-medium text-indigo-700 flex items-center">
                          {clase.dia_semana} 
                          {clase.salon === 1 ? (
                            <span class="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-md ml-2 inline-block">Salón 1</span>
                          ) : (
                            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-md ml-2 inline-block">Salón 2</span>
                          )}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">{clase.hora_inicio} a {clase.hora_fin}</div>
                      </td>
                      <td class="px-4 py-4 text-right">
                        <div class="flex justify-end gap-2 text-gray-400">
                          <a
                            href={`/admin/danzas/${clase.id}/edit`}
                            class="inline-block rounded-md p-1.5 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            title="Editar clase"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                          </a>
                          <Form
                            action={deleteAction}
                            onSubmit$={(e: Event) => {
                              if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="id" value={clase.id} />
                            <button
                              type="submit"
                              class="rounded-md p-1.5 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Eliminar clase"
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

        {/* Media & Config Section */}
        <div class="space-y-8">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2 2.01 2.01 0 0 1-2.01 2.01 2 2 0 0 0-2 2 2.01 2.01 0 0 1-2.01 2.01 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2 2.01 2.01 0 0 1 2.01 2.01 2 2 0 0 0 2 2 2.01 2.01 0 0 1 2.01 2.01 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2 2.01 2.01 0 0 1 2.01-2.01 2 2 0 0 0 2-2 2.01 2.01 0 0 1 2.01-2.01 2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2.01 2.01 0 0 1-2.01-2.01 2 2 0 0 0-2-2 2.01 2.01 0 0 1-2.01-2.01 2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Configuración Web
            </h3>
            
            <Form action={updateConfigAction} class="space-y-6">
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Título del Banner (Hero)</label>
                <Input name="heroTitle" value={data.value.config?.heroTitle || ""} placeholder="Ej: Ritmos en Acción" />
              </div>
              
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción del Banner</label>
                <Input name="heroDescription" value={data.value.config?.heroDescription || ""} placeholder="Breve descripción para el banner..." />
              </div>

              <div class="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit" disabled={updateConfigAction.isRunning}>
                  {updateConfigAction.isRunning ? "Guardando..." : "Guardar Textos"}
                </Button>
              </div>
            </Form>

            <div class="mt-8 pt-8 border-t border-gray-100">
               <PdfUploader
                  label="Subir cronograma (PDF)"
                  currentFileUrl={data.value.config?.pdf_url || null}
                  onUploadCompleted$={async (url) => {
                    updateConfigAction.submit({ pdf_url: url });
                  }}
                />
            </div>
          </div>

          <MultiImageUploader
            currentImageUrls={data.value.galleryUrls}
            maxFiles={12}
            label="Galería de Fotos (Máx 12)"
            onUploadCompleted$={async (urls) => {
              updateGalleryAction.submit({ urls: JSON.stringify(urls) });
            }}
          />
        </div>
      </div>
    </div>
  );
});
