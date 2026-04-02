import { component$, useSignal } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { ImageUploader } from "~/components/ui/ImageUploader";
import { WysiwygEditor } from "~/components/admin/WysiwygEditor";
import { MultiImageUploader } from "~/components/admin/MultiImageUploader";

interface EventFormProps {
  action: any;
  event?: any;
}

export const EventForm = component$<EventFormProps>(({ action, event }) => {
  const imageUrlSig = useSignal<string>(event?.imageUrl || "");
  const galleryUrlsSig = useSignal<string[]>(event?.gallery ? (typeof event.gallery === 'string' ? JSON.parse(event.gallery) : event.gallery) : []);

  let defaultEventDate = "";
  if (event?.eventDate) {
    const d = new Date(event.eventDate);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    defaultEventDate = localISOTime;
  }

  return (
    <div class="max-w-3xl rounded-xl border border-gray-200 bg-white p-8">
      {action.value?.message && !action.value.success && (
        <div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {String(action.value.message)}
        </div>
      )}
      {action.value?.failed && (
        <div class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p class="font-bold">Por favor corregí los errores en el formulario:</p>
          {action.value.fieldErrors && (
            <ul class="mt-2 list-inside list-disc">
              {Object.entries(action.value.fieldErrors).map(
                ([field, errors]) => (
                  <li key={field}>
                    <span class="font-semibold capitalize">{field}</span>:{" "}
                    {Array.isArray(errors) ? errors.join(", ") : String(errors)}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}

      <Form action={action} class="space-y-6">
        <div class="mb-4 text-sm text-gray-500">
          Los campos marcados con un asterisco rojo (<span class="font-bold text-red-500">*</span>) son obligatorios. Los demás son opcionales.
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Título */}
          <div class="md:col-span-2">
            <label for="title" class="mb-2 block text-sm font-semibold text-gray-700 cursor-pointer">
              Título del Evento <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              required
              autofocus={!event}
              value={event?.title || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Tarde de Pastas"
            />
          </div>

          <input type="hidden" name="language" value="es" />

          {/* Fecha Exacta Timestamp */}
          <div class="md:col-span-2">
            <label for="eventDate" class="mb-2 block text-sm font-semibold text-gray-700 cursor-pointer">
              Fecha y Hora del Evento <span class="text-red-500">*</span>
            </label>
            <input
              id="eventDate"
              type="datetime-local"
              name="eventDate"
              required
              value={defaultEventDate}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            <p class="mt-1 text-xs text-gray-400">
              Esta fecha se usará para el ordenamiento cronológico automático.
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Descripción <span class="text-red-500">*</span>
          </label>
          <WysiwygEditor name="description" value={event?.description || ""} />
        </div>

        {/* Imagen Uploader (Portada) */}
        <div class="border-t border-gray-100 pt-6">
          <input type="hidden" name="imageUrl" value={imageUrlSig.value} />
          <ImageUploader
            label="Portada del Evento"
            currentImageUrl={event?.imageUrl || undefined}
            onUploadCompleted$={(url) => {
              imageUrlSig.value = url;
            }}
          />
        </div>

        {/* Galería Uploader */}
        <div class="border-t border-gray-100 pt-6">
          <input type="hidden" name="gallery" value={JSON.stringify(galleryUrlsSig.value)} />
          <MultiImageUploader
            label="Galería de Imágenes Adicionales (Máx 6)"
            currentImageUrls={event?.gallery ? (typeof event.gallery === 'string' ? JSON.parse(event.gallery) : event.gallery) : []}
            onUploadCompleted$={(urls) => {
              galleryUrlsSig.value = urls;
            }}
          />
        </div>

        {/* Acciones */}
        <div class="flex items-center gap-3 border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={action.isRunning}
            class="inline-flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {action.isRunning ? "Guardando..." : "Guardar Evento"}
          </button>
          <Link
            href="/admin/eventos"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
});
