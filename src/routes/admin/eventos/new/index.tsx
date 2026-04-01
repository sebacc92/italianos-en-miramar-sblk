import { component$ } from "@builder.io/qwik";
import { Link, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { EventForm } from "~/components/admin/EventForm";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Nuevo Evento — Admin | Círculo Italiano",
};

export const useCreateEventAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);

    await db.insert(events).values({
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      eventDate: data.datetime || data.eventDate || null,
      language: data.language as "es" | "it",
    });

    throw requestEvent.redirect(302, "/admin/eventos");
  },
  zod$({
    title: z.string().min(1, "El título es obligatorio"),
    datetime: z.string().min(1, "La fecha textual es obligatoria"),
    eventDate: z.string().optional(),
    description: z.string().min(1, "La descripción es obligatoria"),
    imageUrl: z.string().optional(),
    displayOrder: z.string().default("0"),
    language: z.enum(["es", "it"]),
  })
);

export default component$(() => {
  const createAction = useCreateEventAction();

  return (
    <div>
      <div class="mb-8 flex items-center gap-4">
        <Link
          href="/admin/eventos"
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
        >
          <LuArrowLeft class="h-5 w-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-black text-gray-900">Nuevo Evento</h1>
          <p class="mt-1 text-sm text-gray-500">
            Crea un nuevo evento en el idioma seleccionado.
          </p>
        </div>
      </div>

      <EventForm action={createAction} />
    </div>
  );
});
