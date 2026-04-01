import { component$, useSignal } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { ImageUploader } from "~/components/ui/ImageUploader";

interface CourseFormProps {
  action: any;
  course?: any;
}

export const CourseForm = component$<CourseFormProps>(({ action, course }) => {
  const imageUrlSig = useSignal<string>(course?.imageUrl || "");

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
              Nombre del Curso *
            </label>
            <input
              type="text"
              name="title"
              required
              value={course?.title || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Italiano Básico (A1/A2)"
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
              <option value="es" selected={course?.language === "es" || !course}>
                Español (es)
              </option>
              <option value="it" selected={course?.language === "it"}>
                Italiano (it)
              </option>
            </select>
          </div>

          {/* Lenguaje a Enseñar (Columna de esquema requerida) */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Idioma dictado *
            </label>
            <input
              type="text"
              name="courseLanguage"
              required
              value={course?.courseLanguage || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Italiano"
            />
          </div>

          {/* Horarios */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Horarios *
            </label>
            <input
              type="text"
              name="schedule"
              required
              value={course?.schedule || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Martes y Jueves, 18:30hs"
            />
          </div>

          {/* Nivel */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Nivel
            </label>
            <input
              type="text"
              name="level"
              required
              value={course?.level || "Básico"}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: A1, Inicial, Avanzado"
            />
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
            placeholder="Detalles sobre el enfoque, la metodología, etc."
          >{course?.description || ""}</textarea>
        </div>

        {/* Imagen Uploader */}
        <div class="border-t border-gray-100 pt-6">
          <input type="hidden" name="imageUrl" value={imageUrlSig.value} />
          <ImageUploader
            currentImageUrl={course?.imageUrl || undefined}
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
            {action.isRunning ? "Guardando..." : "Guardar Curso"}
          </button>
          <Link
            href="/admin/cursos"
            class="text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancelar
          </Link>
        </div>
      </Form>
    </div>
  );
});
