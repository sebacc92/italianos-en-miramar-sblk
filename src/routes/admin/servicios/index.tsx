import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, routeAction$, type DocumentHead, Form } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { services } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { LuPlus, LuPencil, LuTrash2, LuBuilding2 } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Servicios — Admin | Círculo Italiano",
};

export const useServicesLoader = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db.select().from(services).orderBy(desc(services.id));
});

export const useDeleteServiceAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(services).where(eq(services.id, id));

  return { success: true };
});

export default component$(() => {
  const servicesData = useServicesLoader();
  const deleteAction = useDeleteServiceAction();

  return (
    <div>
      <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-3xl font-black text-gray-900">Servicios y Cultura</h1>
          <p class="mt-1 text-sm text-gray-500">
            Gestiona los salones, espacios e iniciativas culturales.
          </p>
        </div>
        <Link
          href="/admin/servicios/new"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
        >
          <LuPlus class="h-4 w-4" />
          Nuevo Servicio
        </Link>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {servicesData.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <LuBuilding2 class="mb-3 h-12 w-12 text-gray-300" />
            <h3 class="text-lg font-medium text-gray-900">No hay servicios</h3>
            <p class="mt-1 text-sm">Empieza agregando un salón o actividad cultural.</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-6 py-4 font-semibold">Portada</th>
                  <th class="px-6 py-4 font-semibold">Título</th>
                  <th class="px-6 py-4 font-semibold">Categoría</th>
                  <th class="px-6 py-4 font-semibold">Idioma</th>
                  <th class="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 whitespace-nowrap">
                {servicesData.value.map((serv) => (
                  <tr key={serv.id} class="transition-colors hover:bg-gray-50">
                    <td class="px-6 py-4">
                      {serv.imageUrl ? (
                        <img
                          src={serv.imageUrl}
                          alt={serv.title}
                          class="h-10 w-16 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div class="flex h-10 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900">
                      {serv.title}
                    </td>
                    <td class="px-6 py-4 capitalize">{serv.category}</td>
                    <td class="px-6 py-4">
                      <span
                        class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${serv.language === "it"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {serv.language.toUpperCase()}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/servicios/${serv.id}/edit`}
                          class="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                        >
                          <LuPencil class="h-4 w-4" />
                        </Link>
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar este servicio/salón?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={serv.id} />
                          <button
                            type="submit"
                            title="Eliminar servicio"
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
