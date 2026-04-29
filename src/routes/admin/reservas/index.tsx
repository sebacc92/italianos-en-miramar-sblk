import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  type DocumentHead,
  Form,
} from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { reservas_salones } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import { 
  LuCalendarDays, 
  LuTrash2, 
  LuCheckCircle, 
  LuXCircle, 
  LuClock,
  LuPhone,
  LuMail,
  LuUser,
  LuInfo
} from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Reservas de Salones — Admin | Círculo Italiano",
};

export const useReservationsLoader = routeLoader$(async (requestEvent) => {
  const user = requestEvent.sharedMap.get('user');
  const userName = (user?.username || '').toLowerCase();
  const isSalonAdmin = userName === 'seba' || userName === 'laura' || userName === 'mary';

  if (!isSalonAdmin) {
    throw requestEvent.redirect(302, "/admin?error=unauthorized");
  }

  const db = getDb(requestEvent.env);
  return await db.select().from(reservas_salones).orderBy(desc(reservas_salones.created_at));
});

export const useUpdateStatusAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  const nuevoEstado = data.estado as string;

  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.update(reservas_salones)
    .set({ estado: nuevoEstado })
    .where(eq(reservas_salones.id, id));

  return { success: true };
});

export const useDeleteReservationAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(reservas_salones).where(eq(reservas_salones.id, id));

  return { success: true };
});

export default component$(() => {
  const reservations = useReservationsLoader();
  const updateStatus = useUpdateStatusAction();
  const deleteAction = useDeleteReservationAction();

  const getStatusBadge = (estado: string | null) => {
    switch (estado) {
      case 'confirmada':
        return (
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shadow-sm border border-emerald-200">
            <LuCheckCircle class="h-3 w-3" />
            Confirmada
          </span>
        );
      case 'cancelada':
        return (
          <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 shadow-sm border border-rose-200">
            <LuXCircle class="h-3 w-3" />
            Cancelada
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 shadow-sm border border-amber-200">
            <LuClock class="h-3 w-3" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div class="space-y-8 animate-in fade-in duration-500">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-gray-900">Reservas de Salones</h1>
          <p class="mt-2 text-lg text-gray-500">
            Gestiona las solicitudes de alquiler de salones y eventos.
          </p>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
        {reservations.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center p-20 text-center">
            <div class="mb-6 rounded-full bg-gray-50 p-6 ring-8 ring-gray-50/50">
              <LuCalendarDays class="h-16 w-16 text-gray-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">No hay reservas registradas</h3>
            <p class="mt-2 text-gray-500 max-w-sm">
              Cuando alguien complete el formulario de reserva en la web, aparecerá aquí automáticamente.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/80 backdrop-blur-sm text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-5 font-bold">Interesado</th>
                  <th class="px-6 py-5 font-bold">Detalles del Evento</th>
                  <th class="px-6 py-5 font-bold">Estado</th>
                  <th class="px-6 py-5 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {reservations.value.map((res) => (
                  <tr key={res.id} class="group transition-all hover:bg-gray-50/50">
                    <td class="px-6 py-6">
                      <div class="flex flex-col gap-1.5">
                        <div class="flex items-center gap-2 font-bold text-gray-900">
                          <LuUser class="h-4 w-4 text-green-600" />
                          {res.nombre} {res.apellido}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <LuMail class="h-3.5 w-3.5" />
                          {res.email}
                        </div>
                        {res.telefono && (
                          <div class="flex items-center gap-2 text-xs text-gray-500">
                            <LuPhone class="h-3.5 w-3.5" />
                            {res.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      <div class="flex flex-col gap-1.5">
                        <div class="flex items-center gap-2 font-semibold text-gray-800">
                          <span class="rounded-md bg-green-50 px-2 py-0.5 text-[10px] uppercase text-green-700 ring-1 ring-green-600/20">
                            {res.salon}
                          </span>
                          <span class="text-sm">{res.tipo_evento}</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <LuCalendarDays class="h-3.5 w-3.5 text-blue-500" />
                          Fecha: <span class="font-medium text-gray-700">{res.fecha_estimada}</span>
                        </div>
                        <div class="mt-0.5 text-[10px] text-gray-400">
                          Solicitado: {(() => {
                            const dateVal = res.created_at;
                            if (!dateVal) return 'Pendiente';
                            const d = typeof dateVal === 'string' 
                              ? new Date(dateVal.replace(' ', 'T') + 'Z') 
                              : dateVal;
                            return d instanceof Date && !isNaN(d.getTime()) 
                              ? d.toLocaleDateString('es-AR') 
                              : 'Pendiente';
                          })()}
                        </div>
                        {res.mensaje && (
                          <div class="mt-1 flex items-start gap-2 text-xs italic text-gray-400 max-w-xs">
                            <LuInfo class="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            "{res.mensaje}"
                          </div>
                        )}
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      {getStatusBadge(res.estado)}
                    </td>
                    <td class="px-6 py-6 text-right">
                      <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        {res.estado !== 'confirmada' && (
                          <Form action={updateStatus}>
                            <input type="hidden" name="id" value={res.id} />
                            <input type="hidden" name="estado" value="confirmada" />
                            <button
                              type="submit"
                              title="Confirmar reserva"
                              class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
                            >
                              <LuCheckCircle class="h-5 w-5" />
                            </button>
                          </Form>
                        )}
                        {res.estado !== 'cancelada' && (
                          <Form action={updateStatus}>
                            <input type="hidden" name="id" value={res.id} />
                            <input type="hidden" name="estado" value="cancelada" />
                            <button
                              type="submit"
                              title="Cancelar reserva"
                              class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-200 active:scale-95"
                            >
                              <LuXCircle class="h-5 w-5" />
                            </button>
                          </Form>
                        )}
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar esta reserva definitivamente?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={res.id} />
                          <button
                            type="submit"
                            title="Eliminar permanentemente"
                            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-gray-900 hover:text-white hover:shadow-lg hover:shadow-gray-300 active:scale-95"
                          >
                            <LuTrash2 class="h-5 w-5" />
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
