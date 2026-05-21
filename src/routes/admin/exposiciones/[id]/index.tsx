import { component$, $, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { exposiciones, exposicionesObras } from "~/db/schema.server";
import { eq, notInArray, and } from "drizzle-orm";
import {
  LuImagePlus,
  LuSave,
  LuArrowLeft,
  LuTrash2,
  LuLoader2,
  LuCheck,
  LuXCircle
} from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { upload } from "@vercel/blob/client";

export const useExposicionInfo = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const expoId = requestEvent.params.id;
  
  const expoQuery = await db.select().from(exposiciones).where(eq(exposiciones.id, expoId)).limit(1);
  if (expoQuery.length === 0) throw requestEvent.error(404, "Exposición no encontrada");
  const { createdAt: _e, ...expo } = expoQuery[0];
  
  const obrasRaw = await db.select().from(exposicionesObras).where(eq(exposicionesObras.exposicion_id, expoId));
  const obras = obrasRaw.map(({ createdAt, ...rest }) => rest);

  return { expo, obras };
});

export const useSyncObrasAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const expoId = requestEvent.params.id;
  
  let currentUrls: string[] = [];
  try {
    currentUrls = JSON.parse(data.urls as string);
  } catch(e) {
    return requestEvent.fail(400, { error: "URLs malas" });
  }

  // Si se eliminaron fotos, borrarlas de DB
  if (currentUrls.length === 0) {
      await db.delete(exposicionesObras).where(eq(exposicionesObras.exposicion_id, expoId));
  } else {
      await db.delete(exposicionesObras).where(
        and(
          eq(exposicionesObras.exposicion_id, expoId),
          notInArray(exposicionesObras.image_url, currentUrls)
        )
      );
  }

  // Revisar si hay URLs nuevas que no estén en la DB y agregarlas
  const existentes = await db.select({ image_url: exposicionesObras.image_url })
    .from(exposicionesObras)
    .where(eq(exposicionesObras.exposicion_id, expoId));
    
  const existentesUrls = existentes.map(e => e.image_url);
  
  const nuevas = currentUrls.filter(url => !existentesUrls.includes(url));
  
  for (const newUrl of nuevas) {
    await db.insert(exposicionesObras).values({
       exposicion_id: expoId,
       image_url: newUrl,
       titulo_obra: "",
       descripcion_obra: "",
    });
  }

  return { success: true };
});

export const useUpdateMetadatosAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  await db.update(exposicionesObras).set({
    titulo_obra: String(data.titulo_obra || ""),
    descripcion_obra: String(data.descripcion_obra || ""),
  }).where(eq(exposicionesObras.id, String(data.obra_id)));
  
  return { success: true };
});

export const useDeleteObraAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const obraId = String(data.obra_id);
  await db.delete(exposicionesObras).where(eq(exposicionesObras.id, obraId));
  
  return { success: true };
});

export default component$(() => {
  const data = useExposicionInfo();
  const syncAction = useSyncObrasAction();
  const metaAction = useUpdateMetadatosAction();
  const deleteObraAction = useDeleteObraAction();

  const isUploading = useSignal(false);
  const uploadError = useSignal<string | null>(null);

  const handleUpload$ = $(async (event: Event, element: HTMLInputElement) => {
    const files = element.files;
    if (!files || files.length === 0) return;

    if (data.value.obras.length + files.length > 30) {
      uploadError.value = "Solo puedes subir hasta 30 imágenes en total.";
      element.value = "";
      return;
    }

    isUploading.value = true;
    uploadError.value = null;

    try {
      const newUploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filename = file.name.replace(/\s+/g, "_");
        try {
          const newBlob = await upload(filename, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
          newUploadedUrls.push(newBlob.url);
        } catch (err: any) {
          const errMsg = err.message || "";
          if (errMsg.includes("already exists") || errMsg.includes("allowOverwrite") || errMsg.includes("BlobAlreadyExists")) {
            console.warn(`El archivo ${filename} ya existe. Omitiendo y continuando con el resto...`, err);
            continue;
          }
          throw err;
        }
      }

      // Sync final list
      const finalUrls = [
        ...data.value.obras.map(o => o.image_url),
        ...newUploadedUrls
      ];

      await syncAction.submit({ urls: JSON.stringify(finalUrls) });

    } catch (e: any) {
      console.error("Subida fallida:", e);
      uploadError.value = e.message || "La subida falló.";
    } finally {
      isUploading.value = false;
      element.value = "";
    }
  });

  return (
    <div class="space-y-8 animate-in fade-in duration-500">
      {/* Navigation & Header */}
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <a href="/admin/exposiciones" class="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-2">
            <LuArrowLeft class="mr-1 h-4 w-4" /> Volver a Lista
          </a>
          <h1 class="text-4xl font-black text-gray-900">
            Obras: <span class="text-indigo-600 font-bold">{data.value.expo.titulo}</span>
          </h1>
          <p class="mt-2 text-lg text-gray-500">
            Sube las imágenes de la exposición y agrega sus títulos y descripciones.
          </p>
        </div>
      </div>

      {/* Sleek Upload Zone */}
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50">
        <label class="mb-2 block text-sm font-bold text-gray-700">
          Subir nuevas obras (Máximo 30)
        </label>
        <p class="mb-4 text-xs text-gray-500">Sube imágenes en formato JPEG, PNG o WebP. Puedes seleccionar múltiples archivos.</p>
        
        <div class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center transition-all hover:border-indigo-500 hover:bg-indigo-50/20">
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png, image/webp"
            onChange$={handleUpload$}
            disabled={isUploading.value}
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <div class="flex flex-col items-center justify-center">
            <LuImagePlus class="mb-3 h-10 w-10 text-indigo-500" />
            <p class="text-sm font-bold text-gray-700">Arrastra imágenes aquí o haz clic para buscar</p>
            <p class="text-xs text-gray-400 mt-1">Soporta selección múltiple</p>
          </div>
        </div>

        {isUploading.value && (
          <div class="mt-4 flex items-center gap-2 text-sm text-indigo-600 font-semibold justify-center">
            <LuLoader2 class="h-5 w-5 animate-spin" /> Subiendo archivos y actualizando galería...
          </div>
        )}

        {uploadError.value && (
          <div class="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            <LuXCircle class="h-4 w-4 shrink-0" />
            <span>{uploadError.value}</span>
          </div>
        )}
      </div>

      {/* Unified Gallery Grid */}
      <div>
        <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center">
          <LuImagePlus class="mr-2 h-6 w-6 text-indigo-600" />
          Galería de Obras ({data.value.obras.length})
        </h2>

        {data.value.obras.length === 0 ? (
          <div class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center shadow-sm">
            <div class="mb-6 rounded-full bg-gray-50 p-6 ring-8 ring-gray-50/50">
              <LuImagePlus class="h-16 w-16 text-gray-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Esta exposición no tiene obras</h3>
            <p class="mt-2 text-gray-500 max-w-sm">
              Sube las imágenes de las obras de esta exposición en el cuadro de arriba para comenzar.
            </p>
          </div>
        ) : (
          <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data.value.obras.map((obra) => {
              const isSaved = metaAction.value?.success && metaAction.formData?.get('obra_id') === obra.id;
              
              return (
                <div key={obra.id} class="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-200/40 flex flex-col hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
                  {/* Image wrapper */}
                  <div class="relative h-56 w-full bg-black overflow-hidden group-hover:scale-[1.01] transition-transform duration-300">
                    <img 
                      src={obra.image_url} 
                      alt={obra.titulo_obra || "Obra de exposición"} 
                      class="h-full w-full object-cover opacity-95 hover:opacity-100 transition-opacity" 
                      loading="lazy" 
                    />
                    
                    {/* Delete button overlay */}
                    <Form 
                      action={deleteObraAction} 
                      onSubmit$={(e: Event) => {
                        if (!window.confirm("¿Seguro que deseas eliminar esta obra definitivamente?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="obra_id" value={obra.id} />
                      <button 
                        type="submit" 
                        title="Eliminar obra" 
                        class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/90 text-white shadow-lg backdrop-blur-xs transition-all hover:bg-red-700 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 duration-200"
                      >
                        <LuTrash2 class="h-5 w-5" />
                      </button>
                    </Form>
                  </div>

                  {/* Metadata fields */}
                  <div class="p-5 flex-1 flex flex-col">
                    <Form action={metaAction} class="space-y-4 flex-1 flex flex-col justify-between">
                      <input type="hidden" name="obra_id" value={obra.id} />
                      
                      <div class="space-y-3">
                        <div>
                          <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                            Título de la Obra (Opcional)
                          </label>
                          <Input 
                            name="titulo_obra" 
                            placeholder="Ej: Paisaje de otoño" 
                            value={obra.titulo_obra || ''} 
                            class="h-10 text-sm font-semibold border-gray-200 focus:border-indigo-500 focus:ring-indigo-500" 
                          />
                        </div>
                        <div>
                          <label class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                            Descripción (Opcional)
                          </label>
                          <textarea 
                            name="descripcion_obra" 
                            placeholder="Técnica, dimensiones, año..." 
                            rows={3}
                            class="w-full text-sm rounded-xl border border-gray-200 px-3.5 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400 resize-none leading-relaxed" 
                            value={obra.descripcion_obra || ''}
                          />
                        </div>
                      </div>

                      <div class="pt-4 mt-auto">
                        <Button 
                          type="submit" 
                          disabled={metaAction.isRunning && metaAction.formData?.get('obra_id') === obra.id}
                          class={[
                            "w-full h-10 font-bold text-sm transition-all rounded-xl",
                            isSaved 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" 
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                          ].join(" ")}
                        >
                          {metaAction.isRunning && metaAction.formData?.get('obra_id') === obra.id ? (
                            <span class="flex items-center justify-center gap-2">
                              <LuLoader2 class="h-4 w-4 animate-spin" /> Guardando...
                            </span>
                          ) : isSaved ? (
                            <span class="flex items-center justify-center gap-1.5">
                              <LuCheck class="h-4.5 w-4.5" /> ¡Guardado con éxito!
                            </span>
                          ) : (
                            <span class="flex items-center justify-center gap-1.5">
                              <LuSave class="h-4.5 w-4.5" /> Guardar Datos
                            </span>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gestionar Obras — Admin | Círculo Italiano",
};
