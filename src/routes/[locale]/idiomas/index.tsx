import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { CourseList } from '~/components/idiomas/CourseList';
import { InscriptionForm, useSubmitInscription } from '~/components/idiomas/InscriptionForm';
import { Button } from '~/components/ui/Button';
import { _ } from "compiled-i18n";

export { useSubmitInscription };

export default component$(() => {
    return (
        <div class="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white overflow-hidden">
                <div class="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10"></div>
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
                    <span class="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        INSCRIPCIONES ABIERTAS
                    </span>
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Ciclo Lectivo Marzo 2026
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Abriremos las puertas a una nueva experiencia de aprendizaje. Reserva tu lugar en nuestros cursos de italiano e inglés.
                    </p>
                    <Button
                        size="lg"
                        class="text-lg px-8 shadow-xl shadow-green-900/20 animate-in fade-in zoom-in duration-700 delay-300"
                        onClick$={() => {
                            document.getElementById('inscription-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Reservar mi lugar
                    </Button>
                </div>

                {/* Decorative bottom curve */}
                <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg class="relative block w-full h-12 md:h-24 text-gray-50" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
                    </svg>
                </div>
            </section>

            {/* Courses Section */}
            <section class="py-20 container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestra Propuesta Educativa</h2>
                    <div class="w-16 h-1 bg-green-600 mx-auto rounded-full mb-6"></div>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Cursos diseñados para todas las edades y niveles, con un enfoque práctico y cultural.
                    </p>
                </div>

                <CourseList />
            </section>

            {/* Inscription Form Section */}
            <section id="inscription-form" class="py-20 bg-white relative">
                {/* Background decoration */}
                <div class="absolute top-0 inset-x-0 h-40 bg-gray-50"></div>

                <div class="container mx-auto px-4 relative z-10">
                    <InscriptionForm />
                </div>
            </section>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Cursos de Idiomas - Círculo Italiano Joven Italia',
    meta: [
        {
            name: 'description',
            content: 'Inscripciones abiertas para cursos de Italiano e Inglés en Miramar. Ciclo lectivo Marzo 2026. Clases para niños y adultos.',
        },
    ],
};
