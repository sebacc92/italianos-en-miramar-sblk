import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { courses } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { CourseForm } from "~/components/admin/CourseForm";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Editar Curso — Admin | Círculo Italiano",
};

export const useCourseLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = Number(requestEvent.params.id);
  if (!id || isNaN(id)) throw requestEvent.redirect(302, "/admin/cursos");

  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) throw requestEvent.redirect(302, "/admin/cursos");
  return course;
});

export const useUpdateCourseAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    const id = Number(requestEvent.params.id);
    if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

    await db.update(courses).set({
      nombre_curso: data.nombre_curso,
      profesor: data.profesor,
      horarios: data.horarios,
      precio_socio: data.precio_socio,
      precio_no_socio: data.precio_no_socio,
      precio_inscripcion: data.precio_inscripcion,
    }).where(eq(courses.id, id));

    throw requestEvent.redirect(302, "/admin/cursos");
  },
  zod$({
    nombre_curso: z.string().min(1, "El curso es obligatorio"),
    profesor: z.string().min(1, "El profesor es obligatorio"),
    horarios: z.string().min(1, "Los horarios son obligatorios"),
    precio_socio: z.coerce.number().min(0),
    precio_no_socio: z.coerce.number().min(0),
    precio_inscripcion: z.coerce.number().min(0),
  })
);

export default component$(() => {
  const courseData = useCourseLoader();
  const updateAction = useUpdateCourseAction();

  return (
    <div>
      <div class="mb-8 flex items-center gap-4">
        <Link
          href="/admin/cursos"
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
        >
          <LuArrowLeft class="h-5 w-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-black text-gray-900">Editar Curso</h1>
          <p class="mt-1 text-sm text-gray-500">
            Editando: {courseData.value.nombre_curso}
          </p>
        </div>
      </div>

      <CourseForm action={updateAction} course={courseData.value} />
    </div>
  );
});
