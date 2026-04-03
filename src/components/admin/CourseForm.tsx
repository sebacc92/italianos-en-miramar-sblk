import { component$ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";

interface CourseFormProps {
  action: any;
  course?: any;
}

export const CourseForm = component$<CourseFormProps>(({ action, course }) => {

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
              name="nombre_curso"
              required
              value={course?.nombre_curso || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Italiano Básico (A1/A2)"
            />
          </div>

          {/* Profesor */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Profesor *
            </label>
            <input
              type="text"
              name="profesor"
              required
              value={course?.profesor || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Luciano Giacommi"
            />
          </div>

          {/* Horarios */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Horarios *
            </label>
            <input
              type="text"
              name="horarios"
              required
              value={course?.horarios || ""}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Lunes y Miércoles | 15:00 a 16:30"
            />
          </div>

          {/* Precios */}
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Precio Socio ($) *
            </label>
            <input
              type="number"
              name="precio_socio"
              required
              min="0"
              value={course?.precio_socio || 0}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Precio No Socio ($) *
            </label>
            <input
              type="number"
              name="precio_no_socio"
              required
              min="0"
              value={course?.precio_no_socio || 0}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">
              Precio Inscripción ($) *
            </label>
            <input
              type="number"
              name="precio_inscripcion"
              required
              min="0"
              value={course?.precio_inscripcion || 0}
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
          </div>
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
