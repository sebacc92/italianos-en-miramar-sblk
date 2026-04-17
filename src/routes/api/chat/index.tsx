import { type RequestHandler } from '@builder.io/qwik-city';
import { getDb } from '../../../db/client.server';
import { siteSettings, chatSessions, chatMessages, events, courses, services, autoridades } from '../../../db/schema.server';
import { eq, desc } from 'drizzle-orm';
import OpenAI from 'openai';

export const onPost: RequestHandler = async (requestEvent) => {
  try {
    const { request, env, json } = requestEvent;

    // Check if chatbot is enabled before processing
    const db = getDb(env);

    // We expect settings id = "1"
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, '1')).limit(1);

    if (settings && !settings.aiEnabled) {
      json(403, { error: 'El Asistente Virtual se encuentra deshabilitado actualmente.' });
      return;
    }

    const body = await request.json();
    if (!body || !body.messages) {
      json(400, { error: 'Faltan mensajes en la petición.' });
      return;
    }

    const { messages, sessionId } = body;

    if (sessionId) {
      // Registrar o actualizar sesión
      await db.insert(chatSessions).values({
        id: sessionId,
        createdAt: new Date(),
        lastActive: new Date()
      }).onConflictDoUpdate({
        target: chatSessions.id,
        set: { lastActive: new Date() }
      });

      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage && lastUserMessage.role === 'user') {
        const idStr = 'msg-' + Date.now().toString() + Math.random().toString(36).substring(2, 9);
        await db.insert(chatMessages).values({
          id: idStr,
          sessionId: sessionId,
          role: 'user',
          content: lastUserMessage.content,
          createdAt: new Date()
        });
      }
    }

    // Fetch context from DB
    const [allCourses, allServices, allEvents, auths] = await Promise.all([
      db.select().from(courses),
      db.select().from(services),
      db.select().from(events).orderBy(desc(events.createdAt)).limit(10), // only last 10
      db.select().from(autoridades)
    ]);

    const coursesContext = allCourses.map((c) => `- ${c.nombre_curso} (Prof. ${c.profesor}) - Horarios: ${c.horarios}`).join('\n');
    const servicesContext = allServices.map((s) => `- ${s.title} (${s.category})`).join('\n');
    const authoritiesContext = auths.map((a) => `- ${a.nombre}: ${a.cargo}`).join('\n');

    // System prompt
    const systemPrompt = `Eres el Asistente Virtual Oficial de la "Mutual Cultural Círculo Italiano Joven Italia" (conocido como Mutual Italiana de Miramar).
Tu propósito único y exclusivo es asesorar a socios, futuros socios y la comunidad sobre los servicios, cursos, eventos, ciudadanía italiana y la historia de nuestra institución.

CONOCIMIENTO INSTITUCIONAL:
- Historia: Fundada el 29 de junio de 1889 como Sociedad Italiana de Socorros Mutuos.
- Ubicación: Miramar, provincia de Buenos Aires, Argentina.
- Servicios principales: Asesoramiento de Ciudadanía Italiana, Salones para eventos (Salón Giuseppe Verdi, etc), Cursos de Idiomas, Danzas, Nutrición y Arte.

DATOS EN TIEMPO REAL DE LA BASE DE DATOS:
- WhatsApp de Contacto: ${settings?.whatsappNumber || 'No configurado'}
- Novedades y Conocimiento Extra proporcionado por la comisión: "${settings?.aiKnowledge || 'Sin novedades por el momento'}"

### Cursos Disponibles:
${coursesContext || 'No hay cursos registrados en el sistema.'}

### Servicios o Departamentos:
${servicesContext || 'No hay servicios registrados en el sistema.'}

### Comisión y Autoridades:
${authoritiesContext || 'No especificados.'}

REGLAS DE COMPORTAMIENTO (CRÍTICAS):
1. RESTRICCIÓN DE DOMINIO: Si el usuario pregunta cosas que no tienen relación directa o indirecta con el Círculo Italiano, Italia, historia, idioma italiano o cultura, responde con amabilidad que solo estás allí para ayudar con temas del Círculo Italiano Joven Italia.
2. SOLUCIÓN COMPLEJA: Ante dudas que superen esta info o de precios/disponibilidad exacta, recomienda escribir al WhatsApp: "${settings?.aiCallToAction || 'Comunicate a nuestro sistema de turnos/WhatsApp al'} ${settings?.whatsappNumber || ''}".
3. FORMATO Y TONO: ${settings?.aiTone || 'Amigable y profesional'}. Haz respuestas relativamente cortas, usando párrafos breves. Eres un bot de la plataforma. Usa emojis sobrios de ser necesario.`;

    const openaiApiKey = env.get('OPENAI_API_KEY') || (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : '');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY no está configurada.');
      json(500, { error: 'API Key de OpenAI no configurada.' });
      return;
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const openAiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }))
    ];

    let replyText = '';
    const fallbackMessage = `Ups, en este momento tengo una pequeña falla técnica. 😅 Por favor, para dudas precisas comunicate directamente a nuestro WhatsApp oficial: ${settings?.whatsappNumber || ''}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await openai.chat.completions.create(
        {
          model: 'gpt-4o-mini',
          messages: openAiMessages as any,
          max_tokens: 450,
          temperature: 0.35,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      replyText = response.choices[0]?.message?.content || '';

      if (!replyText) {
        console.error('OpenAI validación fallida: respuesta vacía');
        replyText = fallbackMessage;
      }
    } catch (openaiErr: any) {
      console.error('Error procesando respuesta o timeout de OpenAI:', openaiErr);
      replyText = fallbackMessage;
    }

    // Guardar respuesta del assistant
    if (sessionId) {
      const idStr = 'msg-' + Date.now().toString() + Math.random().toString(36).substring(2, 9);
      await db.insert(chatMessages).values({
        id: idStr,
        sessionId: sessionId,
        role: 'assistant',
        content: replyText,
        createdAt: new Date()
      });
    }

    json(200, { reply: { role: 'assistant', content: replyText } });
  } catch (err: any) {
    console.error('Chatbot error:', err);
    requestEvent.json(500, { error: err.message || 'Error inesperado del servidor.' });
  }
};
