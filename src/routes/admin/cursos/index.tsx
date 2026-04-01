import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, type DocumentHead, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { courses } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { LuPlus, LuPencil, LuTrash2, LuBookOpen } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Cursos — Admin | Círculo Italiano",
};

export const useCoursesLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db.select().from(courses).orderBy(desc(courses.id));
});

export const useDeleteCourseAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(courses).where(eq(courses.id, id));

  return { success: true };
});

export default component$(() => {
  const coursesData = useCoursesLoader();
  const deleteAction = useDeleteCourseAction();

  return (
    <div>
      <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Cursos de Idiomas</h1>
          <p class="mt-1 text-sm text-gray-500">
            Administra los cursos de idioma disponibles.
          </p>
        </div>
        <Link
          href="/admin/cursos/new"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
        >
          <LuPlus class="h-4 w-4" />
          Nuevo Curso
        </Link>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {coursesData.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <LuBookOpen class="mb-3 h-12 w-12 text-gray-300" />
            <h3 class="text-lg font-medium text-gray-900">No hay cursos</h3>
            <p class="mt-1 text-sm">Crea el primer curso dictado de la institución.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-6 py-4 font-semibold">Portada</th>
                  <th class="px-6 py-4 font-semibold">Título</th>
                  <th class="px-6 py-4 font-semibold">Idioma Dictado</th>
                  <th class="px-6 py-4 font-semibold">Nivel</th>
                  <th class="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 whitespace-nowrap">
                {coursesData.value.map((course) => (
                  <tr key={course.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-6 py-4">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          class="h-10 w-16 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div class="flex h-10 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td class="px-6 py-4 capitalize">{course.courseLanguage}</td>
                    <td class="px-6 py-4">{course.level}</td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cursos/${course.id}/edit`}
                          class="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                        >
                          <LuPencil class="h-4 w-4" />
                        </Link>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar el curso?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={course.id} />
                          <button
                            type="submit"
                            title="Eliminar curso"
                            class="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
});
