import { component$, useSignal } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { ImageUploader } from "~/components/ui/ImageUploader";

interface EventFormProps {
  action: any;
  event?: any;
}

export const EventForm = component$<EventFormProps>(({ action, event }) => {
  const imageUrlSig = useSignal<string>(event?.imageUrl || "");

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
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Título */}
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Título del Evento *
            </label>
            <input
              type="text"
              name="title"
              required
              value={event?.title || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Tarde de Pastas"
            />
          </div>

          {/* Lenguaje */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Idioma *
            </label>
            <select
              name="language"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            >
              <option value="es" selected={event?.language === "es" || !event}>
                Español (es)
              </option>
              <option value="it" selected={event?.language === "it"}>
                Italiano (it)
              </option>
            </select>
          </div>

          {/* Orden de Visualización */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Orden de Visualización
            </label>
            <input
              type="number"
              name="displayOrder"
              value={event?.displayOrder ?? 0}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            <p class="mt-1 text-xs text-gray-400">
              Número menor aparece primero.
            </p>
          </div>

          {/* Fecha / Hora Texto */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Fecha/Hora (Texto público) *
            </label>
            <input
              type="text"
              name="datetime"
              required
              value={event?.datetime || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Sábado 14 de Marzo, 15:30 hs"
            />
          </div>

          {/* Fecha Exacta Timestamp */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Fecha Exacta (Interna)
            </label>
            <input
              type="datetime-local"
              name="eventDate"
              value={defaultEventDate}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            <p class="mt-1 text-xs text-gray-400">
              Usada para ordenar cronológicamente.
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Descripción *
          </label>
          <textarea
            name="description"
            required
            rows={5}
            class="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            placeholder="Escribe los detalles del evento..."
          >{event?.description || ""}</textarea>
        </div>

        {/* Imagen Uploader */}
        <div class="border-t border-gray-100 pt-6">
          <input type="hidden" name="imageUrl" value={imageUrlSig.value} />
          <ImageUploader
            currentImageUrl={event?.imageUrl || undefined}
            onUploadCompleted$={(url) => {
              imageUrlSig.value = url;
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
