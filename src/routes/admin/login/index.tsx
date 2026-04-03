import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, zod$, z, type DocumentHead } from "@builder.io/qwik-city";
import bcrypt from "bcryptjs";
import { getDb } from "~/db/client.server";
import { users } from "~/db/schema.server";
import { eq } from "drizzle-orm";

export const head: DocumentHead = {
  title: "Login — Admin | Círculo Italiano",
};

// Acción de login pura
export const useLoginAction = routeAction$(
  async (data, { env, cookie, redirect, fail }) => {
    try {
      const db = getDb(env);
      
      // 1. Buscar usuario
      const userResult = await db.select().from(users).where(eq(users.username, data.username)).limit(1);
      const user = userResult[0];

      if (!user) {
        return fail(401, { message: "Usuario o contraseña incorrectos" });
      }

      // 2. Validar contraseña
      const isValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!isValid) {
        return fail(401, { message: "Usuario o contraseña incorrectos" });
      }

      // 3. Actualizar último login (opcional pero recomendado)
      await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

      // 4. Crear sesión (Cookie HttpOnly) por 7 días
      cookie.set("admin_session", user.id.toString(), {
        secure: import.meta.env.PROD,
        httpOnly: true,
        path: "/",
        maxAge: [7, "days"],
        sameSite: "lax",
      });

    } catch (error) {
      console.error("Error en login:", error);
      return fail(500, { message: "Error interno del servidor" });
    }
    
    // 5. Redirigir al panel fuera del try-catch para no interferir con el manejo de estado de Qwik
    throw redirect(302, "/admin");
  },
  zod$({
    username: z.string().min(1, "Usuario requerido"),
    password: z.string().min(1, "Contraseña requerida"),
  })
);

export default component$(() => {
  const loginAction = useLoginAction();

  return (
    <div class="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans text-white">
      <div class="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm">
        
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-white">Círculo Italiano</h1>
          <p class="mt-2 text-sm text-zinc-400">Panel de Administración</p>
        </div>

        <Form action={loginAction} class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium text-zinc-300" for="username">Usuario</label>
            <input 
              id="username"
              type="text" 
              name="username" 
              required 
              class="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]" 
              placeholder="Ingresa tu usuario" 
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-zinc-300" for="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              required 
              class="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]" 
              placeholder="Ingresa tu contraseña" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loginAction.isRunning}
            class="w-full rounded-md bg-[#4CAF50] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#45a049] focus:outline-none disabled:opacity-50"
          >
            {loginAction.isRunning ? "Ingresando..." : "Ingresar"}
          </button>
          
          {loginAction.value?.message && (
             <p class="text-sm text-red-500 text-center mt-2">{loginAction.value.message}</p>
          )}
        </Form>
      </div>
    </div>
  );
});