import { component$, useStyles$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { _, getLocale } from "compiled-i18n";
import ImageExterior from "~/media/exterior_institucion.webp?jsx";
import styles from './HeroSlider.css?inline';

export default component$(({ title, description }: { title: string, description: string }) => {
    useStyles$(styles);
    const currentLocale = getLocale();

    return (
        <section class="hero-section">
            {/* Background image with parallax effect */}
            <div class="hero-bg-wrapper">
                <ImageExterior
                    alt="Sede del Círculo Italiano"
                    class="hero-bg-image"
                />
            </div>

            {/* Refined gradient overlay - lighter and more elegant */}
            <div class="hero-overlay-gradient"></div>

            {/* Subtle vignette effect */}
            <div class="hero-overlay-vignette"></div>

            {/* Content */}
            <div class="hero-content">
                <div class="container mx-auto">
                    <div class="flex justify-center">
                        <div class="max-w-5xl w-full">
                            {/* Flags with improved design */}
                            <div class="hero-flags">
                                <div class="flag-group">
                                    <span class="flag-stripe flag-italy-green"></span>
                                    <span class="flag-stripe flag-white"></span>
                                    <span class="flag-stripe flag-italy-red"></span>
                                </div>
                                <div class="flag-group">
                                    <span class="flag-stripe flag-argentina-blue"></span>
                                    <span class="flag-stripe flag-white"></span>
                                    <span class="flag-stripe flag-argentina-blue"></span>
                                </div>
                            </div>

                            {/* Foundation date badge */}
                            <div class="hero-badge-wrapper">
                                <span class="hero-badge">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {_`home.founded`}
                                </span>
                            </div>

                            {/* Main heading with text shadow for better readability */}
                            <h1 class="hero-title">
                                {title}
                            </h1>

                            {/* Description with enhanced readability */}
                            <p class="hero-description">
                                {description}
                            </p>

                            {/* CTA Button with modern design */}
                            <div class="hero-cta-wrapper">
                                <Link
                                    href={`/${currentLocale}/eventos`}
                                    class="hero-cta-button"
                                >
                                    <span class="hero-cta-content">
                                        {_`home.viewNextEvents`}
                                        <svg class="hero-cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                    {/* Subtle gradient overlay on hover */}
                                    <div class="hero-cta-shine"></div>
                                </Link>
                            </div>

                            {/* Stats or features */}
                            <div class="hero-stats">
                                <div class="hero-stat-item">
                                    <div class="hero-stat-number">136+</div>
                                    <div class="hero-stat-label">Años de historia</div>
                                </div>
                                <div class="hero-stat-item">
                                    <div class="hero-stat-number">400+</div>
                                    <div class="hero-stat-label">Socios activos</div>
                                </div>
                                <div class="hero-stat-item">
                                    <div class="hero-stat-number">50+</div>
                                    <div class="hero-stat-label">Eventos anuales</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced scroll indicator - Clickeable */}
            <a
                href="#servicios"
                class="hero-scroll-indicator"
                aria-label="Ir a servicios"
            >
                <div class="hero-scroll-mouse">
                    <div class="hero-scroll-wheel"></div>
                </div>
            </a>
        </section>
    );
});