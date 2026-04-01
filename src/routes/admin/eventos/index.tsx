import { component$ } from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  routeAction$,
  type DocumentHead,
  Form,
} from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { events } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { LuPlus, LuPencil, LuTrash2, LuCalendarDays } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Eventos — Admin | Círculo Italiano",
};

export const useEventsLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db.select().from(events).orderBy(desc(events.eventDate));
});

export const useDeleteEventAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(events).where(eq(events.id, id));

  return { success: true };
});

export default component$(() => {
  const eventsData = useEventsLoader();
  const deleteAction = useDeleteEventAction();

  return (
    <div>
      <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Eventos</h1>
          <p class="mt-1 text-sm text-gray-500">
            Administra los eventos públicos de la institución.
          </p>
        </div>
        <Link
          href="/admin/eventos/new"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
        >
          <LuPlus class="h-4 w-4" />
          Nuevo Evento
        </Link>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {eventsData.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <LuCalendarDays class="mb-3 h-12 w-12 text-gray-300" />
            <h3 class="text-lg font-medium text-gray-900">No hay eventos</h3>
            <p class="mt-1 text-sm">
              Toca "Nuevo Evento" para crear el primero.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-6 py-4 font-semibold">Portada</th>
                  <th class="px-6 py-4 font-semibold">Título</th>
                  <th class="px-6 py-4 font-semibold">Fecha Textual</th>
                  <th class="px-6 py-4 font-semibold">Idioma</th>
                  <th class="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 whitespace-nowrap">
                {eventsData.value.map((ev) => (
                  <tr key={ev.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-6 py-4">
                      {ev.imageUrl ? (
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          class="h-10 w-16 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div class="flex h-10 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900">
                      {ev.title}
                    </td>
                    <td class="px-6 py-4">{ev.eventDate}</td>
                    <td class="px-6 py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ev.language === "it"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {ev.language.toUpperCase()}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/eventos/${ev.id}/edit`}
                          class="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                          title="Editar evento"
                        >
                          <LuPencil class="h-4 w-4" />
                        </Link>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar este evento?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={ev.id} />
                          <button
                            type="submit"
                            title="Eliminar evento"
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
