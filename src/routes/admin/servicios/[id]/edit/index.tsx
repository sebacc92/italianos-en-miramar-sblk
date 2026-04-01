import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { services } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { ServiceForm } from "~/components/admin/ServiceForm";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Editar Servicio — Admin | Círculo Italiano",
};

export const useServiceLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = Number(requestEvent.params.id);
  if (!id || isNaN(id)) throw requestEvent.redirect(302, "/admin/servicios");

  const [service] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  if (!service) throw requestEvent.redirect(302, "/admin/servicios");
  return service;
});

export const useUpdateServiceAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    const id = Number(requestEvent.params.id);
    if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

    // En servicios, no forzamos re-generar slug dinámicamente si no era requerido editable, 
    // pero si hubiese un slug, lógicamente se haría con title. En schema.ts "services" no usamos slug estricto sino title.

    await db.update(services).set({
      title: data.title,
      language: data.language as "es" | "it",
      category: data.category,
      link: data.link,
      description: data.description,
      imageUrl: data.imageUrl || null,
      isExternal: data.link.startsWith("http"),
    }).where(eq(services.id, id));

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
  const serviceData = useServiceLoader();
  const updateAction = useUpdateServiceAction();

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
          <h1 class="text-3xl font-black text-gray-900">Editar Servicio</h1>
          <p class="mt-1 text-sm text-gray-500">
            Editando: {serviceData.value.title}
          </p>
        </div>
      </div>

      <ServiceForm action={updateAction} service={serviceData.value} />
    </div>
  );
});
