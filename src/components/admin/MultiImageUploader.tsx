import { component$, $, useSignal, type PropFunction } from "@builder.io/qwik";
import { LuImagePlus, LuXCircle, LuLoader2 } from "@qwikest/icons/lucide";

import { upload } from "@vercel/blob/client";

interface MultiImageUploaderProps {
  onUploadCompleted$: PropFunction<(urls: string[]) => void>;
  currentImageUrls?: string[];
  maxFiles?: number;
  label?: string;
}

export const MultiImageUploader = component$<MultiImageUploaderProps>(
  ({ onUploadCompleted$, currentImageUrls = [], maxFiles = 6, label = "Galería de Imágenes (Máx 6)" }) => {
    const isUploading = useSignal(false);
    const previewUrls = useSignal<string[]>([...(currentImageUrls || [])]);
    const uploadError = useSignal<string | null>(null);

    const handleUpload$ = $(async (event: Event, element: HTMLInputElement) => {
      const files = element.files;
      if (!files || files.length === 0) return;

      if (previewUrls.value.length + files.length > maxFiles) {
        uploadError.value = `Solo puedes subir hasta ${maxFiles} imágenes en total.`;
        element.value = "";
        return;
      }

      isUploading.value = true;
      uploadError.value = null;

      const currentTempUrls: string[] = [];

      try {
        const newUploadedUrls: string[] = [];

        // Upload sequentially for simplicity and stability
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const tempUrl = URL.createObjectURL(file);
          currentTempUrls.push(tempUrl);

          // Render temp optimistically
          previewUrls.value = [...previewUrls.value, tempUrl];

          const filename = file.name.replace(/\s+/g, "_");
          const newBlob = await upload(filename, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });

          newUploadedUrls.push(newBlob.url);
        }

        // Replace temp URLs with final URLs
        const finalUrls = [
          ...previewUrls.value.filter(url => !currentTempUrls.includes(url)),
          ...newUploadedUrls
        ];
        
        previewUrls.value = finalUrls;
        await onUploadCompleted$(finalUrls);

      } catch (e: any) {
        console.error("Subida fallida:", e);
        uploadError.value = e.message || "La subida fue rechazada.";
        // Clean up temps from preview if failed
        previewUrls.value = previewUrls.value.filter(url => !currentTempUrls.includes(url));
      } finally {
        isUploading.value = false;
        element.value = ""; // Reset input 
        currentTempUrls.forEach(url => URL.revokeObjectURL(url)); // Clean memory
      }
    });

    const handleRemove$ = $((indexToRemove: number) => {
      if (!window.confirm("¿Seguro que deseas remover esta imagen de la galería?")) return;
      const updatedUrls = previewUrls.value.filter((_, i) => i !== indexToRemove);
      previewUrls.value = updatedUrls;
      onUploadCompleted$(updatedUrls);
    });

    return (
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label class="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
        <p class="mb-4 text-xs text-gray-500">Puedes seleccionar varias imágenes a la vez.</p>

        <div class="space-y-6">
          {/* ZONA DE PREVISUALIZACIÓN */}
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
            {previewUrls.value.map((url, i) => (
              <div key={i} class="group relative flex h-32 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={url}
                  alt={`Preview ${i}`}
                  loading="lazy"
                  class="h-full w-full object-cover transition-opacity duration-300"
                />
                {!isUploading.value && (
                  <button
                    type="button"
                    onClick$={() => handleRemove$(i)}
                    class="absolute right-1 top-1 rounded-full bg-red-600/90 p-1.5 text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-700"
                    title="Remover imagen"
                  >
                    <LuXCircle class="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, maxFiles - previewUrls.value.length) }).map((_, i) => (
              <div key={`empty-${i}`} class="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                 <LuImagePlus class="mb-1 h-6 w-6 text-gray-300" />
              </div>
            ))}
          </div>

          {/* ZONA DE CONTROLES */}
          <div class="relative">
            {isUploading.value && (
               <div class="mb-4 flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <LuLoader2 class="h-4 w-4 animate-spin" /> Subiendo archivo/s...
               </div>
            )}
            
            {previewUrls.value.length < maxFiles && (
              <div class="relative">
                <input
                  type="file"
                  multiple
                  id="multi-image-upload"
                  name="multiImage"
                  accept="image/jpeg, image/png, image/webp"
                  onChange$={handleUpload$}
                  disabled={isUploading.value}
                  class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
                <div class="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                  <LuImagePlus class="h-5 w-5 text-green-600" />
                  <span>Subir imágenes...</span>
                </div>
              </div>
            )}

            {uploadError.value && (
              <div class="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
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
