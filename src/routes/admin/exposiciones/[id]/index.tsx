import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, routeAction$, z, zod$, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { exposiciones, exposicionesObras } from "~/db/schema.server";
import { eq, inArray, notInArray } from "drizzle-orm";
import { LuImagePlus, LuSave, LuArrowLeft } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { MultiImageUploader } from "~/components/admin/MultiImageUploader";

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
       eq(exposicionesObras.exposicion_id, expoId)
       // @ts-ignore : notInArray requires tuple typing but works dynamically
     ).where(notInArray(exposicionesObras.image_url, currentUrls));
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

export default component$(() => {
  const data = useExposicionInfo();
  const syncAction = useSyncObrasAction();
  const metaAction = useUpdateMetadatosAction();

  const currentUrls = data.value.obras.map(o => o.image_url);

  return (
    <div>
      <div class="mb-4 flex items-center justify-between">
        <div>
          <a href="/admin/exposiciones" class="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-2">
            <LuArrowLeft class="mr-1 h-4 w-4" /> Volver a Lista
          </a>
          <h1 class="text-3xl font-black text-gray-900">
            Obras: <span class="text-indigo-600 font-bold">{data.value.expo.titulo}</span>
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Sube las imágenes de la exposición y agrega sus títulos y descripciones.
          </p>
        </div>
      </div>

      <div class="mb-8">
         <MultiImageUploader
            currentImageUrls={currentUrls}
            maxFiles={30}
            label="Galería Privada de la Exposición (Máximo 30 Obras)"
            onUploadCompleted$={async (urls) => {
              syncAction.submit({ urls: JSON.stringify(urls) });
            }}
          />
      </div>

      {data.value.obras.length > 0 && (
         <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-bold text-gray-900 flex items-center">
              <LuImagePlus class="mr-2 h-5 w-5 text-indigo-600" />
              Metadatos de las Obras
            </h2>
            <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {data.value.obras.map((obra) => (
                  <div key={obra.id} class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                     <div class="relative h-48 w-full bg-black">
                        <img src={obra.image_url} class="h-full w-full object-contain opacity-90" loading="lazy" />
                     </div>
                     <div class="p-4 flex-1">
                        <Form action={metaAction} class="space-y-3">
                           <input type="hidden" name="obra_id" value={obra.id} />
                           <div>
                              <label class="text-xs font-bold text-gray-600 mb-1 block">Título de la Obra</label>
                              <Input name="titulo_obra" placeholder="Ej: Atardecer" value={obra.titulo_obra || ''} class="h-8 text-sm" />
                           </div>
                           <div>
                              <label class="text-xs font-bold text-gray-600 mb-1 block">Descripción breve</label>
                              <textarea name="descripcion_obra" placeholder="Técnica, tamaño, detalles..." class="h-16 w-full text-sm resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" value={obra.descripcion_obra || ''}></textarea>
                           </div>
                           <Button type="submit" class="w-full h-8 text-xs font-semibold">
                             <LuSave class="mr-2 h-3 w-3" /> Guardar Datos
                           </Button>
                        </Form>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gestionar Obras — Admin | Círculo Italiano",
};
