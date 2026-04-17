import { component$ } from '@builder.io/qwik';
import { routeLoader$, Link, type DocumentHead } from '@builder.io/qwik-city';
import { getDb } from '../../../../../db/client.server';
import { chatMessages, chatSessions } from '../../../../../db/schema.server';
import { eq, asc } from 'drizzle-orm';
import { LuArrowLeft, LuUser, LuBot } from '@qwikest/icons/lucide';

export const useChatDetail = routeLoader$(async ({ env, params, error }) => {
  const sessionId = params.id;
  const db = getDb(env);

  const [session] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, sessionId))
    .limit(1);

  if (!session) {
    throw error(404, 'Sesión no encontrada');
  }

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt));

  return {
    session,
    messages
  };
});

export default component$(() => {
  const chatDetail = useChatDetail();
  const { session, messages } = chatDetail.value;

  return (
    <div class="mx-auto max-w-4xl space-y-6 pb-20">
      
      <div class="flex items-center gap-4">
        <Link 
          href="/admin/ai/chats" 
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LuArrowLeft class="h-5 w-5" />
        </Link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Detalle de Conversación</h1>
          <p class="text-sm text-gray-500">
            Iniciada: {session.createdAt ? new Date(session.createdAt).toLocaleString('es-AR') : 'N/A'}
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-[70vh]">
        <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
          {messages.length === 0 && (
            <div class="text-center text-gray-500 py-10">No hay mensajes registrados en esta sesión.</div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              class={["flex gap-4", msg.role === 'user' ? "flex-row-reverse" : ""]}
            >
              <div class={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                msg.role === 'user' ? "bg-gray-200 text-gray-600" : "bg-purple-100 text-purple-600"
              ]}>
                {msg.role === 'user' ? <LuUser class="h-5 w-5" /> : <LuBot class="h-5 w-5" />}
              </div>
              
              <div class={[
                "max-w-[75%] rounded-2xl p-4 shadow-sm text-sm",
                msg.role === 'user' 
                  ? "bg-gray-800 text-white rounded-tr-none" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              ]}>
                <p class="whitespace-pre-wrap">{msg.content}</p>
                <div class={[
                  "mt-2 text-xs",
                  msg.role === 'user' ? "text-gray-400" : "text-gray-400"
                ]}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
});

export const head: DocumentHead = {
  title: 'Detalle Chat IA | Admin Círculo Italiano',
};
