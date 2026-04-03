import { type RequestHandler } from "@builder.io/qwik-city";
import { handleUpload } from "@vercel/blob/client";

export const onPost: RequestHandler = async (requestEvent) => {
  const { request, env, json } = requestEvent;

  // 1. Verificación de sesión basada en la cookie nativa
  const sessionCookie = requestEvent.cookie.get("admin_session");

  if (!sessionCookie) {
    requestEvent.status(401);
    throw requestEvent.error(401, "No autorizado. Sesión de administrador requerida.");
  }

  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
         return {
           allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
           tokenPayload: JSON.stringify({
             // Puedes pasar metadata si deseas
           })
         };
      },
      onUploadCompleted: async ({ blob }) => {
        // Podrías guardar metadata o registrar subida en DB aquí
        console.log("Archivo subido:", blob.url);
      },
      token: env.get("BLOB_READ_WRITE_TOKEN"),
    });

    json(200, jsonResponse);
  } catch (error) {
    console.error("Error en handleUpload:", error);
    requestEvent.status(500);
    json(500, { error: "Error interno al procesar la subida." });
  }
};
