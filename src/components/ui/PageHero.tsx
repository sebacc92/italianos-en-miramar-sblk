import { component$, type PropFunction } from "@builder.io/qwik";
import { Button } from "~/components/ui/Button";

interface PageHeroProps {
  bgImageUrl?: string;
  tag?: string;
  title: string | any;
  description: string | any;
  buttonText?: string;
  buttonAction$?: PropFunction<() => void>;
  buttonHref?: string;
}

export const PageHero = component$<PageHeroProps>(({
  bgImageUrl = "/images/exterior_institucion.webp",
  tag,
  title,
  description,
  buttonText,
  buttonAction$,
  buttonHref
}) => {
  return (
    <section class="relative overflow-hidden text-white">
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
        style={{ backgroundImage: `url('${bgImageUrl}')` }}
      ></div>
      <div class="absolute inset-0 bg-black/60"></div>
      
      <div class="relative z-10 container mx-auto px-4 py-24 text-center md:py-32">
        {tag && (
          <span class="animate-in fade-in slide-in-from-bottom-4 mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold tracking-wider backdrop-blur-sm duration-700">
            {tag}
          </span>
        )}
        <h1 class="animate-in fade-in slide-in-from-bottom-6 mb-6 text-4xl leading-tight font-bold delay-100 duration-700 md:text-6xl text-balance">
          {title}
        </h1>
        <p class="animate-in fade-in slide-in-from-bottom-8 mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-200 delay-200 duration-700 md:text-2xl text-balance">
          {description}
        </p>
        
        {buttonText && (
          buttonHref ? (
            <a href={buttonHref}>
              <Button
                size="lg"
                class="animate-in fade-in zoom-in px-8 text-lg shadow-xl shadow-green-900/20 delay-300 duration-700"
              >
                {buttonText}
              </Button>
            </a>
          ) : buttonAction$ ? (
            <Button
              size="lg"
              class="animate-in fade-in zoom-in px-8 text-lg shadow-xl shadow-green-900/20 delay-300 duration-700"
              onClick$={buttonAction$}
            >
              {buttonText}
            </Button>
          ) : null
        )}
      </div>

      {/* Decorative bottom curve matching global bg-gray-50 */}
      <div class="absolute bottom-0 left-0 z-10 w-full overflow-hidden leading-none">
        <svg
          class="relative block h-12 w-full text-gray-50 md:h-24"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
});
