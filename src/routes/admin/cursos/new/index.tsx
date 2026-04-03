import { component$ } from "@builder.io/qwik";
import { Link, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { CourseForm } from "~/components/admin/CourseForm";
import { getDb } from "~/db/client.server";
import { courses } from "~/db/schema.server";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Nuevo Curso — Admin | Círculo Italiano",
};

export const useCreateCourseAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);

    await db.insert(courses).values({
      nombre_curso: data.nombre_curso,
      profesor: data.profesor,
      horarios: data.horarios,
      precio_socio: data.precio_socio,
      precio_no_socio: data.precio_no_socio,
      precio_inscripcion: data.precio_inscripcion,
    });

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
  const createAction = useCreateCourseAction();

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
          <h1 class="text-3xl font-black text-gray-900">Nuevo Curso</h1>
          <p class="mt-1 text-sm text-gray-500">
            Crea un nuevo curso de idiomas.
          </p>
        </div>
      </div>

      <CourseForm action={createAction} />
    </div>
  );
});
