import { component$, useStore, $, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { LuMessageCircle, LuX, LuBot } from "@qwikest/icons/lucide";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const Chatbot = component$(() => {
  const state = useStore({
    isOpen: false,
    isLoading: false,
    messages: [
      {
        role: 'assistant',
        content: '¡Ciao! Soy el asistente virtual del Círculo Italiano Joven Italia de Miramar. ¿En qué te puedo ayudar hoy?',
      },
    ] as Message[],
    sessionId: '',
  });

  const inputValue = useSignal('');
  const messagesContainerRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    let sId = sessionStorage.getItem('chatbot_session_id');
    if (!sId) {
      sId = 'sess-' + Date.now().toString() + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('chatbot_session_id', sId);
    }
    state.sessionId = sId;
  });

  // Scroll to bottom when messages update
  useVisibleTask$(({ track }) => {
    track(() => state.messages.length);
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
    }
  });

  const sendMessage = $(async () => {
    if (!inputValue.value.trim() || state.isLoading) return;

    const userMsg = inputValue.value.trim();
    inputValue.value = '';

    // Add user message to state
    state.messages.push({ role: 'user', content: userMsg });
    state.isLoading = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Only send the last N messages to save tokens and only user/assistant
          messages: state.messages.filter(m => m.role !== 'system').slice(-5),
          sessionId: state.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la conexión');
      }

      const data = await response.json();

      if (data.reply) {
        state.messages.push(data.reply);
      } else {
        state.messages.push({
          role: 'assistant',
          content: 'Ocurrió un error al procesar tu solicitud, intenta nuevamente.',
        });
      }
    } catch (error) {
      console.error('Error de red en chat:', error);
      state.messages.push({
        role: 'assistant',
        content: 'Lo lamento, no pude contactar al servidor. Revisa tu conexión o intenta más tarde.',
      });
    } finally {
      state.isLoading = false;
    }
  });

  return (
    <>
      {!state.isOpen && (
        <span class="fixed z-30 w-14 h-14 sm:w-16 sm:h-16 bottom-6 right-6 bg-[#009246] rounded-full animate-ping opacity-40 pointer-events-none"></span>
      )}
      <button
        type="button"
        onClick$={() => (state.isOpen = !state.isOpen)}
        class={[
          "fixed z-40 p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-[#009246] focus:outline-none",
          state.isOpen
            ? "bg-slate-700 text-white w-12 h-12 bottom-6 right-6 border border-slate-600"
            : "bg-gradient-to-br from-[#009246] via-slate-50 to-[#CE2B37] text-slate-900 w-14 h-14 sm:w-16 sm:h-16 bottom-6 right-6 border-2 border-white shadow-[0_0_15px_rgba(0,146,70,0.5)] hover:shadow-[0_0_25px_rgba(206,43,55,0.5)]"
        ]}
        aria-label="Abrir asistente virtual del Círculo Italiano"
        style={{ contain: "layout paint" }}
      >
        {state.isOpen ? (
          <LuX class="w-6 h-6" />
        ) : (
          <LuMessageCircle class="w-7 h-7 sm:w-8 sm:h-8" />
        )}
      </button>

      {state.isOpen && (
        <div class="fixed z-50 bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 h-[28rem] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div class="bg-gradient-to-r from-[#009246] to-[#CE2B37] text-white p-4 flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <LuBot class="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-sm">Asistente virtual</h3>
              <p class="text-[11px] text-green-100 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block"></span>
                En línea
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            class="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col bg-slate-50 relative"
          >
            {state.messages.map((msg, i) => (
              <div
                key={i}
                class={["flex", msg.role === 'user' ? "justify-end" : "justify-start"]}
              >
                <div
                  class={[
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed",
                    msg.role === 'user'
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                  ]}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {state.isLoading && (
              <div class="flex justify-start">
                <div class="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div class="p-3 bg-white border-t border-slate-100">
            <form
              preventdefault:submit
              onSubmit$={sendMessage}
              class="flex gap-2 relative"
            >
              <input
                type="text"
                bind:value={inputValue}
                placeholder="Escribe tu consulta..."
                class="flex-1 bg-slate-50 text-sm rounded-full pl-4 pr-12 py-2.5 border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                disabled={state.isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.value.trim() || state.isLoading}
                class="absolute right-1 top-1 bottom-1 bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 translate-x-0.5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
});
