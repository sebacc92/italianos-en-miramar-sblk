import { component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  type DocumentHead,
  Form,
} from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { solicitudes_asociacion } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar,
  LuTrash2,
  LuCheckCircle,
  LuXCircle,
  LuClock,
  LuSearch,
  LuEye,
  LuMapPin,
  LuBriefcase,
  LuInfo,
  LuX,
  LuCheck,
  LuUserCheck
} from "@qwikest/icons/lucide";

export const head: DocumentHead = {
  title: "Solicitudes de Socios — Admin | Círculo Italiano",
};

export const useMembershipApplicationsLoader = routeLoader$(async (requestEvent) => {
  const user = requestEvent.sharedMap.get('user');
  const userName = (user?.username || '').toLowerCase();
  const isAuthorized = userName === 'seba' || userName === 'laura' || userName === 'mary';

  if (!isAuthorized) {
    throw requestEvent.redirect(302, "/admin?error=unauthorized");
  }

  const db = getDb(requestEvent.env);
  return await db.select().from(solicitudes_asociacion).orderBy(desc(solicitudes_asociacion.fecha_solicitud));
});

export const useUpdateStatusAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  const nuevoEstado = data.estado as string;

  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.update(solicitudes_asociacion)
    .set({ estado: nuevoEstado })
    .where(eq(solicitudes_asociacion.id, id));

  return { success: true };
});

export const useDeleteApplicationAction = routeAction$(async (data, requestEvent) => {
  const id = Number(data.id);
  if (!id || isNaN(id)) return requestEvent.fail(400, { error: "ID inválido" });

  const db = getDb(requestEvent.env);
  await db.delete(solicitudes_asociacion).where(eq(solicitudes_asociacion.id, id));

  return { success: true };
});

export default component$(() => {
  const applications = useMembershipApplicationsLoader();
  const updateStatus = useUpdateStatusAction();
  const deleteAction = useDeleteApplicationAction();

  const searchQuery = useSignal("");
  const statusFilter = useSignal("todos"); // "todos", "pendiente", "aprobada", "rechazada"
  const selectedApp = useSignal<any>(null);

  // Status counts for filters
  const pendingCount = applications.value.filter(app => app.estado === 'pendiente').length;
  const approvedCount = applications.value.filter(app => app.estado === 'aprobada').length;
  const rejectedCount = applications.value.filter(app => app.estado === 'rechazada').length;
  const totalCount = applications.value.length;

  // Filtered applications
  const filteredApps = applications.value.filter((app) => {
    const matchesStatus = statusFilter.value === "todos" || app.estado === statusFilter.value;
    const searchLower = searchQuery.value.toLowerCase().trim();
    if (!searchLower) return matchesStatus;

    const matchesSearch =
      app.nombre.toLowerCase().includes(searchLower) ||
      app.apellido.toLowerCase().includes(searchLower) ||
      app.dni.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      (app.ciudad && app.ciudad.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (estado: string | null) => {
    switch (estado) {
      case 'aprobada':
        return (
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shadow-sm border border-emerald-200">
            <LuCheckCircle class="h-3 w-3" />
            Aprobada
          </span>
        );
      case 'rechazada':
        return (
          <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 shadow-sm border border-rose-200">
            <LuXCircle class="h-3 w-3" />
            Rechazada
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Pendiente";
    const d = new Date(dateStr.replace(" ", "T") + "Z");
    return d instanceof Date && !isNaN(d.getTime())
      ? d.toLocaleDateString("es-AR")
      : dateStr;
  };

  return (
    <div class="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-gray-900">Solicitudes de Socios</h1>
          <p class="mt-2 text-lg text-gray-500">
            Gestiona los interesados en asociarse al Círculo Italiano.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="text-xs font-bold uppercase tracking-widest text-gray-400">Total Solicitudes</div>
          <div class="mt-2 text-3xl font-black text-gray-900">{totalCount}</div>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="text-xs font-bold uppercase tracking-widest text-amber-500">Pendientes</div>
          <div class="mt-2 text-3xl font-black text-amber-600">{pendingCount}</div>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="text-xs font-bold uppercase tracking-widest text-emerald-500">Aprobadas</div>
          <div class="mt-2 text-3xl font-black text-emerald-600">{approvedCount}</div>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="text-xs font-bold uppercase tracking-widest text-rose-500">Rechazadas</div>
          <div class="mt-2 text-3xl font-black text-rose-600">{rejectedCount}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div class="relative max-w-md flex-1">
          <LuSearch class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, email..."
            value={searchQuery.value}
            onInput$={(e, el) => (searchQuery.value = el.value)}
            class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          {searchQuery.value && (
            <button
              onClick$={() => (searchQuery.value = "")}
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <LuX class="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div class="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 shadow-xs">
          <button
            onClick$={() => (statusFilter.value = "todos")}
            class={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              statusFilter.value === "todos"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick$={() => (statusFilter.value = "pendiente")}
            class={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              statusFilter.value === "pendiente"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick$={() => (statusFilter.value = "aprobada")}
            class={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              statusFilter.value === "aprobada"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            Aprobadas ({approvedCount})
          </button>
          <button
            onClick$={() => (statusFilter.value = "rechazada")}
            class={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              statusFilter.value === "rechazada"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            Rechazadas ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
        {filteredApps.length === 0 ? (
          <div class="flex flex-col items-center justify-center p-20 text-center">
            <div class="mb-6 rounded-full bg-gray-50 p-6 ring-8 ring-gray-50/50">
              <LuUserCheck class="h-16 w-16 text-gray-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">No hay solicitudes</h3>
            <p class="mt-2 text-gray-500 max-w-sm">
              No se encontraron solicitudes que coincidan con la búsqueda o el filtro actual.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-gray-50/80 backdrop-blur-sm text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-5 font-bold">Interesado</th>
                  <th class="px-6 py-5 font-bold">Contacto</th>
                  <th class="px-6 py-5 font-bold">Detalles / Ascendencia</th>
                  <th class="px-6 py-5 font-bold">Estado</th>
                  <th class="px-6 py-5 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} class="group transition-all hover:bg-gray-50/50">
                    <td class="px-6 py-6">
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2 font-bold text-gray-900">
                          <LuUser class="h-4 w-4 text-green-600" />
                          {app.nombre} {app.apellido}
                        </div>
                        <div class="text-xs text-gray-500">
                          DNI: <span class="font-medium text-gray-700">{app.dni}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      <div class="flex flex-col gap-1 text-xs">
                        <div class="flex items-center gap-1.5 text-gray-700">
                          <LuMail class="h-3.5 w-3.5 text-gray-400" />
                          {app.email}
                        </div>
                        <div class="flex items-center gap-1.5 text-gray-700">
                          <LuPhone class="h-3.5 w-3.5 text-gray-400" />
                          {app.telefono}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      <div class="flex flex-col gap-1.5">
                        <div class="flex items-center gap-1.5">
                          {app.tiene_ascendencia_italiana ? (
                            <span class="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700 ring-1 ring-green-600/20">
                              Ascendencia Italiana
                            </span>
                          ) : (
                            <span class="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500 ring-1 ring-gray-400/20">
                              Sin ascendencia
                            </span>
                          )}
                        </div>
                        <div class="text-[10px] text-gray-400">
                          Fecha: {formatDate(app.fecha_solicitud)}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      {getStatusBadge(app.estado)}
                    </td>
                    <td class="px-6 py-6 text-right">
                      <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        {/* Eye details button */}
                        <button
                          type="button"
                          title="Ver detalles completos"
                          onClick$={() => (selectedApp.value = app)}
                          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                        >
                          <LuEye class="h-5 w-5" />
                        </button>

                        {/* Approve button */}
                        {app.estado !== 'aprobada' && (
                          <Form action={updateStatus}>
                            <input type="hidden" name="id" value={app.id} />
                            <input type="hidden" name="estado" value="aprobada" />
                            <button
                              type="submit"
                              title="Aprobar solicitud"
                              class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
                            >
                              <LuCheck class="h-5 w-5" />
                            </button>
                          </Form>
                        )}

                        {/* Reject button */}
                        {app.estado !== 'rechazada' && (
                          <Form action={updateStatus}>
                            <input type="hidden" name="id" value={app.id} />
                            <input type="hidden" name="estado" value="rechazada" />
                            <button
                              type="submit"
                              title="Rechazar solicitud"
                              class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-200 active:scale-95"
                            >
                              <LuX class="h-5 w-5" />
                            </button>
                          </Form>
                        )}

                        {/* Delete button */}
                        <Form
                          action={deleteAction}
                          onSubmit$={(e: Event) => {
                            if (!window.confirm("¿Seguro que deseas eliminar esta solicitud definitivamente?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={app.id} />
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

      {/* Details Modal */}
      {selectedApp.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
            {/* Modal Header */}
            <div class="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 z-10">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <LuUser class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Detalles de la Solicitud</h3>
                  <p class="text-xs text-gray-500">
                    Presentada el {formatDate(selectedApp.value.fecha_solicitud)}
                  </p>
                </div>
              </div>
              <button
                onClick$={() => (selectedApp.value = null)}
                class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <LuX class="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div class="p-6 space-y-6">
              {/* Status Section */}
              <div class="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div class="text-sm font-semibold text-gray-700">Estado actual:</div>
                <div>{getStatusBadge(selectedApp.value.estado)}</div>
              </div>

              {/* Personal Data */}
              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-green-600 border-b pb-1">Datos Personales</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="block text-xs text-gray-400">Nombre Completo</span>
                    <span class="font-semibold text-gray-900">{selectedApp.value.nombre} {selectedApp.value.apellido}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">DNI</span>
                    <span class="font-semibold text-gray-900">{selectedApp.value.dni}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Fecha de Nacimiento</span>
                    <span class="font-medium text-gray-900">
                      {(() => {
                        if (!selectedApp.value.fecha_nacimiento) return "-";
                        // Standard birth date display
                        try {
                          const parts = selectedApp.value.fecha_nacimiento.split("-");
                          if (parts.length === 3) {
                            return `${parts[2]}/${parts[1]}/${parts[0]}`;
                          }
                        } catch {}
                        return selectedApp.value.fecha_nacimiento;
                      })()}
                    </span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Nacionalidad</span>
                    <span class="font-medium text-gray-900">{selectedApp.value.nacionalidad}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Profesión</span>
                    <span class="font-medium text-gray-900">{selectedApp.value.profesion || "-"}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Estado Civil</span>
                    <span class="font-medium text-gray-900 capitalize">{selectedApp.value.estado_civil || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Contact and Address */}
              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-green-600 border-b pb-1">Contacto y Domicilio</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="block text-xs text-gray-400">Correo Electrónico</span>
                    <a href={`mailto:${selectedApp.value.email}`} class="font-medium text-blue-600 hover:underline">{selectedApp.value.email}</a>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Teléfono</span>
                    <a href={`tel:${selectedApp.value.telefono}`} class="font-medium text-blue-600 hover:underline">{selectedApp.value.telefono}</a>
                  </div>
                  <div class="col-span-2">
                    <span class="block text-xs text-gray-400">Domicilio</span>
                    <span class="font-medium text-gray-900">
                      {selectedApp.value.domicilio}, {selectedApp.value.ciudad} {selectedApp.value.codigo_postal ? `(CP ${selectedApp.value.codigo_postal})` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div class="space-y-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-green-600 border-b pb-1">Información de la Asociación</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="block text-xs text-gray-400">Ascendencia Italiana</span>
                    <span class="font-semibold text-gray-900">
                      {selectedApp.value.tiene_ascendencia_italiana ? "Sí" : "No"}
                    </span>
                  </div>
                  <div>
                    <span class="block text-xs text-gray-400">Socios Presentantes</span>
                    <div class="font-medium text-gray-900">
                      {selectedApp.value.socio_presentante_1 || selectedApp.value.socio_presentante_2 ? (
                        <ul class="list-disc pl-4 text-xs">
                          {selectedApp.value.socio_presentante_1 && <li>{selectedApp.value.socio_presentante_1}</li>}
                          {selectedApp.value.socio_presentante_2 && <li>{selectedApp.value.socio_presentante_2}</li>}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                  <div class="col-span-2">
                    <span class="block text-xs text-gray-400">Motivo de Asociación</span>
                    <div class="mt-1 rounded-lg bg-gray-50 p-3 text-xs italic text-gray-600 border border-gray-100 whitespace-pre-line leading-relaxed">
                      "{selectedApp.value.motivo_asociacion}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
              <div>
                <Form
                  action={deleteAction}
                  onSubmit$={(e: Event) => {
                    if (window.confirm("¿Seguro que deseas eliminar esta solicitud definitivamente?")) {
                      selectedApp.value = null;
                    } else {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={selectedApp.value.id} />
                  <button
                    type="submit"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
                  >
                    <LuTrash2 class="h-4 w-4" />
                    Eliminar
                  </button>
                </Form>
              </div>

              <div class="flex items-center gap-2">
                {selectedApp.value.estado !== "pendiente" && (
                  <Form action={updateStatus} onSubmit$={() => { selectedApp.value = null; }}>
                    <input type="hidden" name="id" value={selectedApp.value.id} />
                    <input type="hidden" name="estado" value="pendiente" />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Restablecer Pendiente
                    </button>
                  </Form>
                )}

                {selectedApp.value.estado !== "aprobada" && (
                  <Form action={updateStatus} onSubmit$={() => { selectedApp.value = null; }}>
                    <input type="hidden" name="id" value={selectedApp.value.id} />
                    <input type="hidden" name="estado" value="aprobada" />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <LuCheck class="h-4 w-4" />
                      Aprobar
                    </button>
                  </Form>
                )}

                {selectedApp.value.estado !== "rechazada" && (
                  <Form action={updateStatus} onSubmit$={() => { selectedApp.value = null; }}>
                    <input type="hidden" name="id" value={selectedApp.value.id} />
                    <input type="hidden" name="estado" value="rechazada" />
                    <button
                      type="submit"
                      class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                    >
                      <LuX class="h-4 w-4" />
                      Rechazar
                    </button>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
