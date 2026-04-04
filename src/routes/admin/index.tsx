import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getDb } from "~/db/client.server";
import { users, events, courses, danzasCronograma, arteCursos, nutricionHorarios, autoridades } from "~/db/schema.server";
import { count, eq } from "drizzle-orm";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import * as bcrypt from "bcryptjs";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";

export const head: DocumentHead = {
  title: "Dashboard — Admin | Círculo Italiano",
};

export const useDashboardStats = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  
  const [
    eventosCount,
    cursosCount,
    danzasCount,
    arteCount,
    nutricionCount,
    autoridadesCount,
  ] = await Promise.all([
    db.select({ value: count() }).from(events),
    db.select({ value: count() }).from(courses),
    db.select({ value: count() }).from(danzasCronograma),
    db.select({ value: count() }).from(arteCursos),
    db.select({ value: count() }).from(nutricionHorarios),
    db.select({ value: count() }).from(autoridades),
  ]);

  return {
    user: requestEvent.sharedMap.get('user') || { username: 'Administrador' },
    eventos: eventosCount[0].value,
    cursos: cursosCount[0].value,
    danzas: danzasCount[0].value,
    arte: arteCount[0].value,
    nutricion: nutricionCount[0].value,
    autoridades: autoridadesCount[0].value,
  };
});

export const useUpdatePassword = routeAction$(
  async (data, requestEvent) => {
    const user = requestEvent.sharedMap.get('user');
    if (!user || typeof user.id !== 'number') {
      return { success: false, message: "No autorizado" };
    }

    if (data.password_nueva !== data.confirmar_password_nueva) {
      return { success: false, message: "Las contraseñas nuevas no coinciden" };
    }

    const db = getDb(requestEvent.env);
    
    // Obtener hash actual
    const [dbUser] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, user.id));
      
    if (!dbUser) return { success: false, message: "Usuario no encontrado" };
    
    // Verificar original
    const isValid = await bcrypt.compare(data.password_actual, dbUser.passwordHash);
    if (!isValid) return { success: false, message: "La contraseña actual es incorrecta" };
    
    // Guardar nuevo
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(data.password_nueva, salt);
    
    await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
    
    return { success: true, message: "Contraseña actualizada con éxito. La próxima vez que inicies sesión usa la nueva clave." };
  },
  zod$({
    password_actual: z.string().min(1, "Debes ingresar tu contraseña actual"),
    password_nueva: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmar_password_nueva: z.string().min(6, "La confirmación no coincide"),
  })
);

export default component$(() => {
  const stats = useDashboardStats();
  const pwdAction = useUpdatePassword();
  const userName = String(stats.value.user.username).toLowerCase();

  const isDanzaNutriUser = userName === 'flor' || userName === 'martinap' || userName === 'martina';
  const isArteUser = userName === 'natalia';

  return (
    <div class="space-y-6">
      <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 class="text-3xl font-black text-gray-900">
          ¡Hola, <span class="capitalize text-green-600">{userName}</span>!
        </h1>
        <p class="mt-2 text-gray-600">
          Bienvenido al panel de administración del Círculo Italiano. Aquí un resumen del sistema.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(!isDanzaNutriUser && !isArteUser) && (
          <>
            <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span class="mb-2 text-5xl font-black text-green-600">{stats.value.autoridades}</span>
              <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Autoridades
              </span>
            </div>
            <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span class="mb-2 text-5xl font-black text-green-600">{stats.value.eventos}</span>
              <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Eventos Activos
              </span>
            </div>
            <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span class="mb-2 text-5xl font-black text-green-600">{stats.value.cursos}</span>
              <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Cursos Idiomas
              </span>
            </div>
          </>
        )}

        {(!isArteUser) && (
          <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span class="mb-2 text-5xl font-black text-green-600">{stats.value.danzas}</span>
            <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Clases de Danza
            </span>
          </div>
        )}

        {(!isArteUser) && (
          <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span class="mb-2 text-5xl font-black text-green-600">{stats.value.nutricion}</span>
            <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Horarios Nutrición
            </span>
          </div>
        )}

        {(!isDanzaNutriUser) && (
          <div class="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span class="mb-2 text-5xl font-black text-green-600">{stats.value.arte}</span>
            <span class="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Talleres de Arte
            </span>
          </div>
        )}
      </div>

      <div class="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Mi Perfil: Seguridad</h2>
        
        <Form action={pwdAction} class="max-w-md space-y-4">
          {pwdAction.value && (
            <div class={`rounded-xl p-4 text-sm font-medium shadow-sm mb-4 border ${pwdAction.value.success ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {String(pwdAction.value.message)}
            </div>
          )}

          <div class="space-y-2">
            <Label for="password_actual">Contraseña Actual</Label>
            <Input name="password_actual" id="password_actual" type="password" placeholder="Tu contraseña actual" />
            {pwdAction.value?.fieldErrors?.password_actual && (
              <p class="mt-1 text-xs text-red-600">{pwdAction.value.fieldErrors.password_actual}</p>
            )}
          </div>
          <div class="space-y-2">
            <Label for="password_nueva">Nueva Contraseña</Label>
            <Input name="password_nueva" id="password_nueva" type="password" placeholder="Mínimo 6 caracteres" />
            {pwdAction.value?.fieldErrors?.password_nueva && (
              <p class="mt-1 text-xs text-red-600">{pwdAction.value.fieldErrors.password_nueva}</p>
            )}
          </div>
          <div class="space-y-2">
            <Label for="confirmar_password_nueva">Confirmar Nueva Contraseña</Label>
            <Input name="confirmar_password_nueva" id="confirmar_password_nueva" type="password" placeholder="Escribe tu nueva contraseña de nuevo" />
            {pwdAction.value?.fieldErrors?.confirmar_password_nueva && (
              <p class="mt-1 text-xs text-red-600">{pwdAction.value.fieldErrors.confirmar_password_nueva}</p>
            )}
          </div>
          
          <div class="pt-4">
            <Button type="submit" disabled={pwdAction.isRunning}>
              {pwdAction.isRunning ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
});
