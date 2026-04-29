import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, routeAction$, z, zod$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { arteCursos, arteConfig, arteGaleria } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { LuPlus, LuTrash2, LuPalette, LuFileEdit, LuSettings } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { WysiwygEditor } from "~/components/admin/WysiwygEditor";
import { MultiImageUploader } from "~/components/admin/MultiImageUploader";

export const head: DocumentHead = {
  title: "Taller de Arte — Admin | Círculo Italiano",
};

export const useArteLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const data = await db.select().from(arteCursos).orderBy(desc(arteCursos.id));
  return data;
});

export const useConfigLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const configRaw = await db.select().from(arteConfig).where(eq(arteConfig.id, "1")).limit(1);
  const config = configRaw.length > 0 ? configRaw[0] : null;

  const galleryRaw = await db.select().from(arteGaleria).orderBy(desc(arteGaleria.createdAt));
  const galleryUrls = galleryRaw.map((g) => g.imageUrl);

  return { config, galleryUrls };
});

export const useUpdateConfigAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const existing = await db.select().from(arteConfig).where(eq(arteConfig.id, "1")).limit(1);

  if (existing.length > 0) {
    await db.update(arteConfig).set({
      telefono_1: data.telefono_1,
      telefono_2: data.telefono_2,
      descripcion_libre: data.descripcion_libre,
    }).where(eq(arteConfig.id, "1"));
  } else {
    await db.insert(arteConfig).values({
      id: "1",
      telefono_1: data.telefono_1,
      telefono_2: data.telefono_2,
      descripcion_libre: data.descripcion_libre,
    });
  }
  return { success: true };
}, zod$({
  telefono_1: z.string().optional(),
  telefono_2: z.string().optional(),
  descripcion_libre: z.string().optional(),
}));

export const useUpdateGalleryAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);

  let urls: string[] = [];
  try {
    urls = JSON.parse(data.urls as string);
  } catch (e) {
    return requestEvent.fail(400, { error: "URLs inválidas" });
  }

  await db.delete(arteGaleria);

  if (urls.length > 0) {
    const values = urls.map(url => ({ imageUrl: url }));
    await db.insert(arteGaleria).values(values);
  }

  return { success: true };
});

export const useCreateArteAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.insert(arteCursos).values({
    nombre: data.nombre,
    descripcion: data.descripcion,
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  });
  return { success: true };
}, zod$({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
}));

export const useUpdateArteAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.update(arteCursos).set({
    nombre: data.nombre,
    descripcion: data.descripcion,
    dia_semana: data.dia_semana,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  }).where(eq(arteCursos.id, id));

  return { success: true };
}, zod$({
  id: z.string(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  dia_semana: z.string().min(1, "El día es obligatorio"),
  hora_inicio: z.string().min(1, "Inicio es obligatorio"),
  hora_fin: z.string().min(1, "Fin es obligatorio"),
}));

export const useDeleteArteAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(arteCursos).where(eq(arteCursos.id, id));
  return { success: true };
});

export default component$(() => {
  const cursos = useArteLoader();
  const configData = useConfigLoader();

  const updateConfigAction = useUpdateConfigAction();
  const updateGalleryAction = useUpdateGalleryAction();

  const createAction = useCreateArteAction();
  const updateAction = useUpdateArteAction();
  const deleteAction = useDeleteArteAction();

  const showAddForm = useSignal(false);
  const editingId = useSignal<number | null>(null);

  // Derivamos los datos del config para legibilidad
  const config = configData.value.config;
  const galleryUrls = configData.value.galleryUrls;

  return (
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900">Taller de Arte</h1>
        <p class="mt-1 text-sm text-gray-500">
          Administra los talleres, descripción frontal y la galería de fotos.
        </p>
      </div>

      {/* GRID DE PANELES */}
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">

        {/* SECCIÓN CONFIGURACIÓN WEB */}
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <LuSettings class="mr-2 h-5 w-5 text-gray-600" /> Configuración Web
            </h2>
          </div>

          <Form action={updateConfigAction} class="space-y-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Teléfono 1</label>
                <Input name="telefono_1" placeholder="Ej: 2291..." value={config?.telefono_1 || ''} />
              </div>
              <div>
                <label class="mb-1 block text-sm font-semibold text-gray-700">Teléfono 2 (Opcional)</label>
                <Input name="telefono_2" placeholder="Opcional" value={config?.telefono_2 || ''} />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-gray-700">Descripción Principal (Aparece arriba en la web)</label>
              <div class="prose-sm">
                <WysiwygEditor
                  name="descripcion_libre"
                  value={config?.descripcion_libre || ''}
                  placeholder="Ej: Te invitamos a sumarte a nuestros talleres de arte para desarrollar tu creatividad..."
                />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <Button type="submit" disabled={updateConfigAction.isRunning}>
                {updateConfigAction.isRunning ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </div>
          </Form>
        </div>

        {/* GALERÍA DE FOTOS */}
        <div>
          <MultiImageUploader
            currentImageUrls={galleryUrls}
            maxFiles={9}
            label="Galería de Fotos (Máx 9)"
            onUploadCompleted$={async (urls) => {
              updateGalleryAction.submit({ urls: JSON.stringify(urls) });
            }}
          />
        </div>

      </div>

      {/* SECCIÓN TALLERES */}
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Talleres Estructurados</h2>
          <Button
            variant="outline"
            onClick$={() => (showAddForm.value = !showAddForm.value)}
          >
            <LuPlus class="mr-2 h-4 w-4" />
            Nuevo Taller
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
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Nombre del Taller</label>
                  <Input name="nombre" placeholder="Ej: Pintura para Niños" required />
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
                  <label class="mb-1 block text-sm font-semibold text-gray-700">Descripción del Taller</label>
                  <Input name="descripcion" placeholder="Ej: Breve resumen de qué se enseña..." required />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick$={() => (showAddForm.value = false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createAction.isRunning}>
                  {createAction.isRunning ? "Guardando..." : "Guardar Taller"}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {cursos.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <LuPalette class="mb-3 h-10 w-10 text-gray-300" />
            <p>No hay talleres configurados</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-semibold">Taller</th>
                  <th class="px-4 py-3 font-semibold">Horario</th>
                  <th class="px-4 py-3 font-semibold">Descripción</th>
                  <th class="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {cursos.value.map((curso) => {
                  if (editingId.value === curso.id) {
                    return (
                      <tr key={curso.id} class="bg-blue-50">
                        <td colSpan={4} class="p-4 border border-blue-200 shadow-inner">
                          <Form action={updateAction} class="space-y-4" onSubmitCompleted$={() => {
                            if (updateAction.value?.success) {
                              editingId.value = null;
                            }
                          }}>
                            <input type="hidden" name="id" value={curso.id} />
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <div>
                                <label class="mb-1 block text-xs font-semibold text-gray-700">Nombre</label>
                                <Input name="nombre" value={curso.nombre} required />
                              </div>
                              <div>
                                <label class="mb-1 block text-xs font-semibold text-gray-700">Día</label>
                                <select name="dia_semana" required class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                                  <option value="Lunes" selected={curso.dia_semana === 'Lunes'}>Lunes</option>
                                  <option value="Martes" selected={curso.dia_semana === 'Martes'}>Martes</option>
                                  <option value="Miércoles" selected={curso.dia_semana === 'Miércoles'}>Miércoles</option>
                                  <option value="Jueves" selected={curso.dia_semana === 'Jueves'}>Jueves</option>
                                  <option value="Viernes" selected={curso.dia_semana === 'Viernes'}>Viernes</option>
                                  <option value="Sábado" selected={curso.dia_semana === 'Sábado'}>Sábado</option>
                                </select>
                              </div>
                              <div>
                                <label class="mb-1 block text-xs font-semibold text-gray-700">Horarios (Inicio/Fin)</label>
                                <div class="flex gap-2">
                                  <Input type="time" name="hora_inicio" value={curso.hora_inicio} required />
                                  <Input type="time" name="hora_fin" value={curso.hora_fin} required />
                                </div>
                              </div>
                              <div class="sm:col-span-2 lg:col-span-4">
                                <label class="mb-1 block text-xs font-semibold text-gray-700">Descripción</label>
                                <Input name="descripcion" value={curso.descripcion} required />
                              </div>
                            </div>
                            <div class="flex justify-end gap-2">
                              <Button type="button" variant="ghost" onClick$={() => (editingId.value = null)}>
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={updateAction.isRunning}>
                                {updateAction.isRunning ? "Guardando..." : "Guardar Cambios"}
                              </Button>
                            </div>
                          </Form>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={curso.id} class="transition-colors hover:bg-gray-50">
                      <td class="px-4 py-3 font-bold text-gray-900">{curso.nombre}</td>
                      <td class="px-4 py-3">{curso.dia_semana} ({curso.hora_inicio} a {curso.hora_fin})</td>
                      <td class="px-4 py-3 truncate max-w-xs">{curso.descripcion}</td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick$={() => (editingId.value = curso.id)}
                            class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Editar"
                          >
                            <LuFileEdit class="h-4 w-4" />
                          </button>
                          <Form
                            action={deleteAction}
                            onSubmit$={(e: Event) => {
                              if (!window.confirm("¿Seguro que deseas eliminar este taller?")) e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="id" value={curso.id} />
                            <button
                              type="submit"
                              class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Eliminar"
                            >
                              <LuTrash2 class="h-4 w-4" />
                            </button>
                          </Form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});
