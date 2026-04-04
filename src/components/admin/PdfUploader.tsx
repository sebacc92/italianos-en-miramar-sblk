import { component$, $, useSignal, type PropFunction } from "@builder.io/qwik";
import { LuFile, LuXCircle, LuLoader2, LuUploadCloud } from "@qwikest/icons/lucide";
import { upload } from "@vercel/blob/client";

interface PdfUploaderProps {
  onUploadCompleted$: PropFunction<(url: string) => void>;
  currentFileUrl?: string | null;
  label?: string;
}

export const PdfUploader = component$<PdfUploaderProps>(
  ({ onUploadCompleted$, currentFileUrl, label = "Subir Documento (PDF)" }) => {
    const isUploading = useSignal(false);
    const fileUrl = useSignal<string | null>(currentFileUrl || null);
    const uploadError = useSignal<string | null>(null);

    const handleUpload$ = $(async (event: Event, element: HTMLInputElement) => {
      const files = element.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file.type !== "application/pdf") {
        uploadError.value = "Solo se permiten archivos en formato PDF.";
        element.value = "";
        return;
      }

      isUploading.value = true;
      uploadError.value = null;

      try {
        const filename = file.name.replace(/\s+/g, "_");
        const newBlob = await upload(filename, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        fileUrl.value = newBlob.url;
        await onUploadCompleted$(newBlob.url);

      } catch (e: any) {
        console.error("Subida fallida:", e);
        uploadError.value = e.message || "La subida fue rechazada.";
      } finally {
        isUploading.value = false;
        element.value = ""; // Reset input 
      }
    });

    const handleRemove$ = $(() => {
      if (!window.confirm("¿Seguro que deseas remover el documento actual?")) return;
      fileUrl.value = null;
      onUploadCompleted$(""); // "" denotes removal
    });

    return (
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label class="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
        
        <div class="space-y-4">
          {/* ZONA DE ARCHIVO ACTUAL */}
          {fileUrl.value ? (
            <div class="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div class="flex items-center gap-3">
                 <div class="rounded-full bg-blue-100 p-2 text-blue-600">
                    <LuFile class="h-6 w-6" />
                 </div>
                 <div>
                    <p class="text-sm font-bold text-gray-900 line-clamp-1 break-all">Documento Actual</p>
                    <a href={fileUrl.value} target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 hover:underline">
                      Ver PDF subido
                    </a>
                 </div>
              </div>
              {!isUploading.value && (
                <button
                  type="button"
                  onClick$={handleRemove$}
                  class="rounded bg-white border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>
          ) : (
            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-gray-400">
               <LuUploadCloud class="mb-2 h-8 w-8 text-gray-300" />
               <p class="text-sm">Ningún archivo PDF asociado</p>
            </div>
          )}

          {/* ZONA DE CONTROLES */}
          <div class="relative">
            {isUploading.value && (
               <div class="mb-4 flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <LuLoader2 class="h-4 w-4 animate-spin" /> Subiendo archivo a la nube...
               </div>
            )}
            
            <div class="relative mt-2">
              <input
                type="file"
                id="pdf-upload"
                name="pdfUpload"
                accept="application/pdf"
                onChange$={handleUpload$}
                disabled={isUploading.value}
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
              <div class="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 w-full justify-center">
                <LuUploadCloud class="h-5 w-5 text-green-600" />
                <span>{fileUrl.value ? "Reemplazar documento..." : "Subir documento PDF..."}</span>
              </div>
            </div>

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
