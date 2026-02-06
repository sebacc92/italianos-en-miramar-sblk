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
        })
    );

    return (
        <button
            type="button"
            aria-label="Scroll to top"
            onClick$={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            class={`fixed z-50 bottom-6 right-6 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${show.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                } bg-primary text-white hover:bg-primary/90`}
            style={{ contain: 'layout paint' }}
        >
            <LuChevronUp class="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
    );
});
