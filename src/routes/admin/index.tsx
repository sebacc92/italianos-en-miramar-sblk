import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useSession } from "~/routes/plugin@auth";

export const head: DocumentHead = {
  title: "Dashboard — Admin | Círculo Italiano",
};

export default component$(() => {
  const session = useSession();
  const userName = session.value?.user?.email?.split("@")[0] || "Administrador";

  return (
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 class="text-3xl font-black text-gray-900">
          ¡Hola, <span class="capitalize text-green-600">{userName}</span>!
        </h1>
        <p class="mt-2 text-gray-600">
          Bienvenido al panel de administración del Círculo Italiano. Selecciona una opción en el menú lateral para gestionar el contenido.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">--</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Eventos
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">--</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Cursos
          </span>
        </div>
        <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span class="mb-2 text-5xl font-black text-green-600">--</span>
          <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Servicios
          </span>
        </div>
      </div>
    </div>
  );
});
