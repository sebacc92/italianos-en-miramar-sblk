import { type RequestHandler } from "@builder.io/qwik-city";
import { put } from "@vercel/blob";

export const onPost: RequestHandler = async (requestEvent) => {
  const { request, env, json } = requestEvent;

  // 1. Verificación de sesión basada en la cookie nativa
  const sessionCookie = requestEvent.cookie.get("admin_session");

  if (!sessionCookie) {
    requestEvent.status(401);
    throw requestEvent.error(401, "No autorizado. Sesión de administrador requerida.");
  }

  try {
    // 2. Extraer el archivo del formData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name) {
      requestEvent.status(400);
      json(400, {
        error: "No se encontró ningún archivo válido en la petición.",
      });
      return;
    }

    // 3. Subir a Vercel Blob usando put
    const filename = file.name.replace(/\s+/g, "_");

    // Para entornos Edge usando QwikCity, se pasa explícitamente el token del env
    const blobToken = env.get("BLOB_READ_WRITE_TOKEN");

    const blob = await put(filename, file, {
      access: "public",
      token: blobToken,
    });

    // 4. Retornar URL pública
    json(200, { url: blob.url });
    return;
  } catch (error) {
    console.error("Error subiendo el archivo a Vercel Blob:", error);
    requestEvent.status(500);
    json(500, { error: "Error interno al procesar la subida." });
    return;
  }
};
