import { component$ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, type DocumentHead } from '@builder.io/qwik-city';
import { getDb } from '../../../../db/client.server';
import { siteSettings } from '../../../../db/schema.server';
import { eq } from 'drizzle-orm';
import { LuBot, LuSave } from '@qwikest/icons/lucide';

// Load settings
export const useAiSettings = routeLoader$(async ({ env }) => {
  const db = getDb(env);
  let [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, '1')).limit(1);

  if (!settings) {
    // defaults if empty
    settings = {
      id: '1',
      aiEnabled: false,
      whatsappNumber: '+5492291555555',
      aiKnowledge: 'No hay novedades recientes.',
      aiCallToAction: 'Comunicate al WhatsApp de secretaría:',
      aiTone: 'Amigable y muy respetuoso',
    };
  }
  return settings;
});

// Update action
export const useSaveAiSettingsAction = routeAction$(async (data, { env, fail }) => {
  const aiEnabled = data.aiEnabled === 'on' || data.aiEnabled === 'true';
  const whatsappNumber = data.whatsappNumber as string;
  const aiKnowledge = data.aiKnowledge as string;
  const aiCallToAction = data.aiCallToAction as string;
  const aiTone = data.aiTone as string;

  try {
    const db = getDb(env);
    
    await db.insert(siteSettings).values({
      id: '1',
      aiEnabled,
      whatsappNumber,
      aiKnowledge,
      aiCallToAction,
      aiTone,
    }).onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        aiEnabled,
        whatsappNumber,
        aiKnowledge,
        aiCallToAction,
        aiTone,
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error('Error saving AI settings:', err);
    return fail(500, { message: 'Error interno al guardar los ajustes.' });
  }
});

export default component$(() => {
  const settingsLoader = useAiSettings();
  const saveAction = useSaveAiSettingsAction();

  return (
    <div class="mx-auto max-w-4xl space-y-6 pb-20">
      
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm">
          <LuBot class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ajustes del Asistente Virtual</h1>
          <p class="text-gray-500">Configura el comportamiento, tono y conocimientos del Chatbot de IA del Círculo Italiano.</p>
        </div>
      </div>

      {saveAction.value?.success && (
        <div class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 flex items-center gap-2">
          ✅ Los ajustes han sido guardados correctamente.
        </div>
      )}
      {saveAction.value?.failed && (
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 flex items-center gap-2">
          ❌ {saveAction.value.message}
        </div>
      )}

      <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Form action={saveAction} class="p-6 md:p-8 space-y-8">
          
          <div class="flex items-center justify-between pb-6 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Estado del Chatbot</h3>
              <p class="text-sm text-gray-500">Activa o desactiva la visibilidad del asistente virtual en toda la página web.</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" name="aiEnabled" class="peer sr-only" checked={settingsLoader.value.aiEnabled ?? false} />
              <div class="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
            </label>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Número de WhatsApp</label>
              <input 
                type="text" 
                name="whatsappNumber" 
                value={settingsLoader.value.whatsappNumber || ''} 
                class="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500" 
                placeholder="+5492291..." 
              />
              <p class="text-xs text-gray-500">Número al que el bot derivará consultas complejas.</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Call to Action (CTA)</label>
              <input 
                type="text" 
                name="aiCallToAction" 
                value={settingsLoader.value.aiCallToAction || ''} 
                class="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500" 
                placeholder="Por favor, comunicate al:" 
              />
              <p class="text-xs text-gray-500">Frase antes de dar el número de WhatsApp.</p>
            </div>
          </div>

          <div class="space-y-2">
             <label class="text-sm font-medium text-gray-700">Tono de voz de la IA</label>
             <input 
               type="text" 
               name="aiTone" 
               value={settingsLoader.value.aiTone || ''} 
               class="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500" 
               placeholder="Respetuoso, amable, informativo..." 
             />
             <p class="text-xs text-gray-500">Ejemplo: "Amigable, usa emojis, no seas muy formal" o "Muy profesional y formal".</p>
          </div>

          <div class="space-y-2">
             <label class="text-sm font-medium text-gray-700">Conocimiento Adicional (Novedades)</label>
             <textarea 
               name="aiKnowledge" 
               rows={4}
               class="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500" 
               placeholder="Ej: Este fin de semana hay 2x1 en entradas..."
             >{settingsLoader.value.aiKnowledge || ''}</textarea>
             <p class="text-xs text-gray-500">Usa este espacio para darle a la IA noticias temporales o reglas excepcionales libres.</p>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              class="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 hover:shadow-md transition-all active:scale-95"
            >
              <LuSave class="h-4 w-4" />
              Guardar Configuración
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Ajustes IA | Admin Círculo Italiano',
};
