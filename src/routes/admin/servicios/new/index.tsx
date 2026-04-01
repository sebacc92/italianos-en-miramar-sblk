import { component$ } from "@builder.io/qwik";
import { Link, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { ServiceForm } from "~/components/admin/ServiceForm";
import { getDb } from "~/db/client.server";
import { services } from "~/db/schema.server";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Nuevo Servicio — Admin | Círculo Italiano",
};

export const useCreateServiceAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);

    await db.insert(services).values({
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: data.title,
      language: data.language as any,
      category: data.category,
      link: data.link,
      description: data.description,
      imageUrl: data.imageUrl || null,
      ctaText: "Saber más",
      isExternal: data.link.startsWith("http"),
    });

    throw requestEvent.redirect(302, "/admin/servicios");
  },
  zod$({
    title: z.string().min(1, "El nombre es obligatorio"),
    language: z.enum(["es", "it"]),
    category: z.string().min(1, "La categoría es obligatoria"),
    link: z.string().min(1, "El enlace externo o interno es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    imageUrl: z.string().optional(),
  })
);

export default component$(() => {
  const createAction = useCreateServiceAction();

  return (
    <div>
      <div class="mb-8 flex items-center gap-4">
        <Link
          href="/admin/servicios"
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
        >
          <LuArrowLeft class="h-5 w-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-black text-gray-900">Nuevo Servicio</h1>
          <p class="mt-1 text-sm text-gray-500">
            Agrega un nuevo salón, actividad o servicio general.
          </p>
        </div>
      </div>

      <ServiceForm action={createAction} />
    </div>
  );
});
