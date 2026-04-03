import { component$, $, useSignal, type PropFunction } from "@builder.io/qwik";
import { LuImagePlus, LuXCircle, LuLoader2, LuCheckCircle2 } from "@qwikest/icons/lucide";

import { upload } from "@vercel/blob/client";

interface ImageUploaderProps {
  onUploadCompleted$: PropFunction<(url: string) => void>;
  currentImageUrl?: string;
  label?: string;
}

export const ImageUploader = component$<ImageUploaderProps>(
  ({ onUploadCompleted$, currentImageUrl, label = "Subir Imagen Frontal" }) => {
    const isUploading = useSignal(false);
    const previewUrl = useSignal<string | null>(currentImageUrl || null);
    const uploadError = useSignal<string | null>(null);
    const uploadSuccess = useSignal(false);

    const handleUpload$ = $(async (event: Event, element: HTMLInputElement) => {
      const file = element.files?.[0];
      if (!file) return;

      isUploading.value = true;
      uploadError.value = null;
      uploadSuccess.value = false;

      let tempUrl: string | null = null;

      try {
        // 1. Mostrar preview temporal para mejor UX
        tempUrl = URL.createObjectURL(file);
        previewUrl.value = tempUrl;

        // 2. Usar cliente nativo de Vercel Blob
        const filename = file.name.replace(/\s+/g, "_");
        const newBlob = await upload(filename, file, {
           access: 'public',
           handleUploadUrl: '/api/upload',
        });

        // 3. Emitir al componente padre la url definitiva
        await onUploadCompleted$(newBlob.url);
        
        previewUrl.value = newBlob.url; // Reset al valor final real
        uploadSuccess.value = true;
      } catch (e: any) {
        console.error("Subida fallida:", e);
        uploadError.value = e.message || "La subida fue rechazada.";
        previewUrl.value = currentImageUrl || null; // Rollback
      } finally {
        isUploading.value = false;
        element.value = ""; // Reset input 
        if (tempUrl) URL.revokeObjectURL(tempUrl); // Limpiar memoria
      }
    });

    const handleClear$ = $(() => {
      previewUrl.value = null;
      uploadSuccess.value = false;
      onUploadCompleted$(""); // Enviar string vacío para borrar de BD
    });

    return (
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label class="mb-4 block text-sm font-semibold text-gray-700">
          {label}
        </label>

        <div class="flex flex-col gap-6 md:flex-row md:items-start">
          {/* ZONA DE PREVISUALIZACIÓN */}
          <div class="group relative flex h-48 w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors md:w-64">
            {previewUrl.value ? (
              <>
                <img
                  src={previewUrl.value}
                  alt="Preview"
                  loading="lazy"
                  class={`h-full w-full object-cover transition-opacity duration-300 ${
                    isUploading.value ? "opacity-30 mix-blend-grayscale" : "opacity-100"
                  }`}
                  width="250"
                  height="200"
                />
                {/* Botón para remover imagen actual */}
                {!isUploading.value && (
                  <button
                    type="button"
                    onClick$={handleClear$}
                    class="absolute right-2 top-2 rounded-full bg-red-600/90 p-1.5 text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-700"
                    title="Remover imagen"
                  >
                    <LuXCircle class="h-5 w-5" />
                  </button>
                )}
              </>
            ) : (
              <div class="flex flex-col items-center text-gray-400">
                <LuImagePlus class="mb-2 h-10 w-10 text-gray-300" />
                <span class="text-xs font-medium uppercase tracking-widest">
                  Sin imagen
                </span>
              </div>
            )}

            {/* Spinner Overlay */}
            {isUploading.value && (
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40 text-white backdrop-blur-sm">
                <LuLoader2 class="mb-2 h-8 w-8 animate-spin text-green-400" />
                <span class="animate-pulse font-semibold text-sm">Subiendo...</span>
              </div>
            )}
            
            {/* Success Overlay Velo Temporal */}
            {uploadSuccess.value && !isUploading.value && (
               <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-green-500/20 opacity-0 animate-[fadeOut_2s_ease-out_forwards]">
                  <LuCheckCircle2 class="h-12 w-12 text-green-600 drop-shadow-md" />
               </div>
            )}
          </div>

          {/* ZONA DE CONTROLES */}
          <div class="flex-1 space-y-4">
            <div class="relative">
              <input
                type="file"
                id="image-upload"
                name="image"
                accept="image/jpeg, image/png, image/webp"
                onChange$={handleUpload$}
                disabled={isUploading.value}
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                aria-label="Seleccionar imagen"
              />
              <div class="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                <LuImagePlus class="h-5 w-5 text-green-600" />
                <span>Elegir nueva imagen desde tu equipo...</span>
              </div>
            </div>

            <p class="text-xs leading-relaxed text-gray-500">
              Formatos soportados: <strong>JPG, PNG, WEBP</strong>. Peso
              máximo recomendado: <strong>4MB</strong>. La subida y
              optimización en Vercel Blob comienza automáticamente al
              seleccionar el archivo.
            </p>

            {uploadError.value && (
              <div class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                <LuXCircle class="h-4 w-4 shrink-0" />
                <span>{uploadError.value}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
