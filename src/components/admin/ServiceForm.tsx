import { component$, useSignal } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { ImageUploader } from "~/components/ui/ImageUploader";

interface ServiceFormProps {
  action: any;
  service?: any;
}

export const ServiceForm = component$<ServiceFormProps>(({ action, service }) => {
  const imageUrlSig = useSignal<string>(service?.imageUrl || "");

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
          {/* Nombre / Título */}
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              name="title"
              required
              value={service?.title || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Salón Princpal 'Garibaldi'"
            />
          </div>

          {/* Lenguaje de Visualización */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Idioma (Versión web) *
            </label>
            <select
              name="language"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            >
              <option value="es" selected={service?.language === "es" || !service}>
                Español (es)
              </option>
              <option value="it" selected={service?.language === "it"}>
                Italiano (it)
              </option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Categoría
            </label>
            <select
              name="category"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            >
              <option value="salon" selected={service?.category === "salon" || !service}>Salones / Espacios</option>
              <option value="cultura" selected={service?.category === "cultura"}>Cultura e Historia</option>
              <option value="evento-privado" selected={service?.category === "evento-privado"}>Eventos Privados</option>
              <option value="otro" selected={service?.category === "otro"}>Otro</option>
            </select>
          </div>
          
          {/* Link (obligatorio en BD) */}
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Enlace / Ruta (Link) *
            </label>
            <input
              type="text"
              name="link"
              required
              value={service?.link || "#"}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: /es/servicios/salon, o https://..."
            />
            <p class="text-xs text-gray-400 mt-1">Hacia dónde lleva este servicio cuando hacen click.</p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Descripción Corta *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            class="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            placeholder="Breve reseña sobre este servicio..."
          >{service?.description || ""}</textarea>
        </div>

        {/* Imagen Uploader */}
        <div class="border-t border-gray-100 pt-6">
          <input type="hidden" name="imageUrl" value={imageUrlSig.value} />
          <ImageUploader
            currentImageUrl={service?.imageUrl || undefined}
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
            {action.isRunning ? "Guardando..." : "Guardar Servicio"}
          </button>
          <Link
            href="/admin/servicios"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
});
