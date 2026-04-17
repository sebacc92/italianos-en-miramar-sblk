import { component$ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, Link, type DocumentHead } from '@builder.io/qwik-city';
import { getDb } from '../../../../db/client.server';
import { chatSessions, chatMessages } from '../../../../db/schema.server';
import { desc, count, eq } from 'drizzle-orm';
import { LuMessageSquare, LuTrash2, LuEye } from '@qwikest/icons/lucide';

export const useChatSessions = routeLoader$(async ({ env }) => {
  const db = getDb(env);
  
  const sessions = await db
    .select({
      id: chatSessions.id,
      createdAt: chatSessions.createdAt,
      lastActive: chatSessions.lastActive,
      messageCount: count(chatMessages.id),
    })
    .from(chatSessions)
    .leftJoin(chatMessages, eq(chatSessions.id, chatMessages.sessionId))
    .groupBy(chatSessions.id)
    .orderBy(desc(chatSessions.lastActive));
    
  return sessions;
});

export const useDeleteChatAction = routeAction$(async (data, { env, fail }) => {
  const id = data.id as string;
  if (!id) return fail(400, { message: 'ID no proporcionado.' });

  try {
    const db = getDb(env);
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, id));
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
    return { success: true };
  } catch (err) {
    console.error('Error deleting chat session:', err);
    return fail(500, { message: 'Error interno al eliminar el chat.' });
  }
});

export default component$(() => {
  const sessionsLoader = useChatSessions();
  const deleteAction = useDeleteChatAction();

  return (
    <div class="mx-auto max-w-5xl space-y-6 pb-20">
      
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm">
          <LuMessageSquare class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Auditoría de Conversaciones</h1>
          <p class="text-gray-500">Revisa el historial de interacciones que los visitantes tienen con la IA.</p>
        </div>
      </div>

      {deleteAction.value?.success && (
        <div class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
          ✅ Conversación eliminada exitosamente.
        </div>
      )}
      {deleteAction.value?.failed && (
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
          ❌ {deleteAction.value.message}
        </div>
      )}

      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Creado</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Último Mensaje</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Interacciones</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {sessionsLoader.value.map((session) => (
                <tr key={session.id} class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {session.createdAt ? new Date(session.createdAt).toLocaleString('es-AR') : 'N/A'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.lastActive ? new Date(session.lastActive).toLocaleString('es-AR') : 'N/A'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {session.messageCount} mensajes
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/ai/chats/${session.id}/`} 
                        class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Ver Conversación"
                      >
                        <LuEye class="h-5 w-5" />
                      </Link>
                      <Form action={deleteAction}>
                        <input type="hidden" name="id" value={session.id} />
                        <button
                          type="submit"
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Chat"
                          onClick$={(e) => {
                            if (!confirm(`¿Seguro que deseas eliminar este chat y sus ${session.messageCount} mensajes de forma permanente?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <LuTrash2 class="h-5 w-5" />
                        </button>
                      </Form>
                    </div>
                  </td>
                </tr>
              ))}
              {sessionsLoader.value.length === 0 && (
                <tr>
                  <td colSpan={4} class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                      <LuMessageSquare class="h-10 w-10 text-gray-300 mb-2" />
                      <p>No hay conversaciones con la IA aún.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Auditoría IA | Admin Círculo Italiano',
};
