import { component$ } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import { useSignIn } from "~/routes/plugin@auth";

export const head: DocumentHead = {
  title: "Login — Admin | Círculo Italiano",
};

export default component$(() => {
  const action = useSignIn();

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      {/* Background decoration */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div class="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div class="mb-10 text-center">
          <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/30">
            <span
              class="text-2xl font-black text-white"
            >
              C.I.
            </span>
          </div>
          <h1
            class="text-2xl font-black text-white"
          >
            Panel de Administración
          </h1>
          <p class="mt-1 text-sm text-gray-400">
            Círculo Italiano
          </p>
        </div>

        {/* Card */}
        <div class="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <h2 class="mb-6 text-base font-semibold text-white">
            Iniciar sesión
          </h2>

          <Form action={action} class="space-y-5">
            <input type="hidden" name="providerId" value="credentials" />
            <input type="hidden" name="options.callbackUrl" value="/admin" />

            <div>
              <label
                for="email"
                class="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="admin@italianos.com"
              />
            </div>

            <div>
              <label
                for="password"
                class="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            {/* Auth.js exposes error via action.value url redirects, but also on the action if it fails in case of misconfiguration. 
                For credentials error display, we can check search params later if we want. */}
            {action.value?.failed && (
              <div class="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/15 px-4 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width={2}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p class="text-sm text-red-400">Credenciales incorrectas.</p>
              </div>
            )}

            <button
              type="submit"
              class="w-full rounded-lg bg-green-600 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-green-600/20 transition-all duration-200 hover:bg-green-500 disabled:opacity-60"
            >
              {action.isRunning ? "Verificando..." : "Ingresar"}
            </button>
          </Form>
        </div>

        <p class="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Círculo Italiano
        </p>
      </div>
    </div>
  );
});
