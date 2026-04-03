import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { users, preinscripciones } from "~/db/schema.server";
import { desc } from "drizzle-orm";
import { LuTerminal, LuUser, LuClock, LuShield, LuClipboardList, LuCalendarClock } from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Cleverisma Core — SUPERADMIN | Círculo Italiano",
};

export const useCleverismaCoreData = routeLoader$(async ({ env }) => {
  const db = getDb(env);

  const usuarios = await db.select({
    id: users.id,
    username: users.username,
    role: users.role,
    ultimo_acceso: users.ultimo_acceso,
  }).from(users);

  const solicitudesRaw = await db.select()
    .from(preinscripciones)
    .orderBy(desc(preinscripciones.fecha_creacion));

  const solicitudes = solicitudesRaw.map(sol => {
    let validDate: string | null = null;
    if (sol.fecha_creacion) {
      const d = new Date(sol.fecha_creacion);
      if (!isNaN(d.getTime())) {
        validDate = d.toISOString();
      }
    }
    return {
      ...sol,
      fecha_creacion: validDate
    };
  });

  return { usuarios, solicitudes };
});

export default component$(() => {
  const data = useCleverismaCoreData();

  return (
    <div class="space-y-8">
      {/* Header */}
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-green-500 shadow-md">
          <LuTerminal class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-gray-900">Cleverisma Core</h1>
          <p class="text-sm text-gray-500">
            Vista maestra de SUPERADMIN. Auditoría de usuarios y flujos de preinscripción.
          </p>
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-2">
        {/* Auditoría de Usuarios */}
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LuShield class="h-5 w-5 text-gray-400" />
              Auditoría de Accesos
            </h2>
            <span class="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">
              {data.value.usuarios.length} Usuarios
            </span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-6 py-3 font-semibold text-gray-900">Usuario</th>
                  <th class="px-6 py-3 font-semibold text-gray-900">Rol</th>
                  <th class="px-6 py-3 font-semibold text-gray-900">Último Acceso</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {data.value.usuarios.map((user) => (
                  <tr key={user.id} class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        <LuUser class="h-4 w-4" />
                      </div>
                      {user.username}
                    </td>
                    <td class="px-6 py-4">
                      <span class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td class="px-6 py-4 flex items-center gap-2 text-gray-500">
                      <LuClock class="h-4 w-4" />
                      {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flujo de Inscripciones */}
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col max-h-[600px]">
          <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LuClipboardList class="h-5 w-5 text-gray-400" />
              Flujos del Frontend
            </h2>
            <span class="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">
              {data.value.solicitudes.length} Registros
            </span>
          </div>
          
          <div class="overflow-y-auto p-2">
            {data.value.solicitudes.length === 0 ? (
              <div class="p-6 text-center text-sm text-gray-500">
                No hay solicitudes o preinscripciones registradas.
              </div>
            ) : (
              <ul class="divide-y divide-gray-100">
                {data.value.solicitudes.map((sol) => (
                  <li key={sol.id} class="p-4 hover:bg-gray-50 transition-colors rounded-lg m-2 border border-transparent hover:border-gray-100">
                    <div class="flex items-center justify-between mb-2">
                      <span class="inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                        {sol.curso}
                      </span>
                      <div class="flex items-center text-xs text-gray-400 gap-1 lg:gap-2">
                        <LuCalendarClock class="h-3.5 w-3.5" />
                        {sol.fecha_creacion ? new Date(sol.fecha_creacion).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <p class="text-sm font-bold text-gray-900">{sol.nombre}</p>
                    <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{sol.email}</span>
                      <span>{sol.telefono}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
