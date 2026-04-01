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

    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await db.insert(courses).values({
      slug: slug,
      title: data.title,
      language: data.language as any,
      courseLanguage: data.courseLanguage,
      level: data.level,
      description: data.description,
      imageUrl: data.imageUrl || null,
      schedule: data.schedule || null,
    });

    throw requestEvent.redirect(302, "/admin/cursos");
  },
  zod$({
    title: z.string().min(1, "El título es obligatorio"),
    language: z.enum(["es", "it"]),
    courseLanguage: z.string().min(1, "El idioma de enseñanza es obligatorio"),
    schedule: z.string().min(1, "El horario es obligatorio"),
    level: z.string().default("Básico"),
    description: z.string().min(1, "La descripción es obligatoria"),
    imageUrl: z.string().optional(),
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
