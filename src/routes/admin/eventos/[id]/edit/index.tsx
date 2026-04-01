import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, z, zod$, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { EventForm } from "~/components/admin/EventForm";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Editar Evento — Admin | Círculo Italiano",
};

export const useEventLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = Number(requestEvent.params.id);
  if (!id || isNaN(id)) throw requestEvent.redirect(302, "/admin/eventos");

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) throw requestEvent.redirect(302, "/admin/eventos");
  return event;
});

export const useUpdateEventAction = routeAction$(
  async (data, requestEvent) => {
    const db = getDb(requestEvent.env);
    const id = Number(requestEvent.params.id);
    if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

    await db.update(events).set({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      eventDate: data.datetime || data.eventDate || null,
      language: data.language as "es" | "it",
    }).where(eq(events.id, id));

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
  const eventData = useEventLoader();
  const updateAction = useUpdateEventAction();

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
          <h1 class="text-3xl font-black text-gray-900">Editar Evento</h1>
          <p class="mt-1 text-sm text-gray-500">
            Editando: {eventData.value.title}
          </p>
        </div>
      </div>

      <EventForm action={updateAction} event={eventData.value} />
    </div>
  );
});
