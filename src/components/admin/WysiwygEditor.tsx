import { component$, useSignal, useVisibleTask$, useStylesScoped$, $ } from "@builder.io/qwik";

interface WysiwygEditorProps {
  name: string;
  value?: string;
  placeholder?: string;
}

export const WysiwygEditor = component$<WysiwygEditorProps>(({ name, value, placeholder }) => {
  useStylesScoped$(`
    .ql-container {
      font-size: 14px;
      font-family: inherit;
    }
    .ql-editor {
      min-height: 200px;
    }
  `);

  const containerRef = useSignal<Element>();
  const htmlContent = useSignal(value || "");

  useVisibleTask$(({ track }) => {
    track(() => containerRef.value);
    
    if (containerRef.value) {
      // We load Quill via CDN dynamically so we don't bundle it
      const loadQuill = async () => {
        if (!(window as any).Quill) {
          const script = document.createElement('script');
          script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
          
          const style = document.createElement('link');
          style.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
          style.rel = 'stylesheet';
          
          document.head.appendChild(style);
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const Quill = (window as any).Quill;
        
        // Ensure we don't initialize twice
        if (containerRef.value && !containerRef.value.hasAttribute('data-quill-initialized')) {
          const quill = new Quill(containerRef.value, {
            theme: 'snow',
            placeholder: placeholder || 'Escribe aquí...',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]
            }
          });
          
          // Seed initial content safely
          if (value) {
            const delta = quill.clipboard.convert(value);
            quill.setContents(delta, 'silent');
          }

          if (containerRef.value) {
             containerRef.value.setAttribute('data-quill-initialized', 'true');
          }

          quill.on('text-change', () => {
            htmlContent.value = quill.root.innerHTML;
          });
        }
      };

      loadQuill();
    }
  });

  return (
    <div class="rounded-lg border border-gray-300 bg-white">
      {/* Hidden input to pass data to Qwik City Form action */}
      <input type="hidden" name={name} value={htmlContent.value} />
      <div class="h-full w-full">
        <div ref={containerRef} class="min-h-[200px]" />
      </div>
    </div>
  );
});
