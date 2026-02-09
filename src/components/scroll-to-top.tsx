import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import { LuChevronUp } from "@qwikest/icons/lucide";

export const ScrollToTop = component$(() => {
  const show = useSignal(false);

  useOnWindow(
    "scroll",
    $(() => {
      // Use requestAnimationFrame for smooth UI updates
      requestAnimationFrame(() => {
        show.value = window.scrollY > 120;
      });
    }),
  );

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick$={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      class={`focus:ring-primary fixed right-6 bottom-6 z-50 transform rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 focus:ring-2 focus:outline-none ${
        show.value
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      } bg-primary hover:bg-primary/90 text-white`}
      style={{ contain: "layout paint" }}
    >
      <LuChevronUp class="h-6 w-6 sm:h-8 sm:w-8" />
    </button>
  );
});
