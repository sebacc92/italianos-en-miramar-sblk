import { component$ } from '@builder.io/qwik';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { LuCheck, LuArrowRight } from '@qwikest/icons/lucide';

export const COURSES = [
    {
        id: 'italiano-inicial',
        language: 'italiano',
        title: 'Italiano Inicial',
        level: 'Nivel A1',
        description: 'Ideal para quienes comienzan desde cero. Aprenderás las bases del idioma y la cultura.',
        features: ['Gramática esencial', 'Fonética básica', 'Cultura general'],
        schedule: 'Martes y Jueves 18:00hs',
        highlight: false,
    },
    {
        id: 'italiano-infantil',
        language: 'italiano',
        title: 'Italiano Infantil',
        level: 'Niños 6-12 años',
        description: 'Un espacio lúdico para aprender jugando. Canciones, juegos y primeros pasos en el idioma.',
        features: ['Juegos interactivos', 'Canciones tradicionales', 'Aprendizaje natural'],
        schedule: 'Sábados 10:00hs',
        highlight: true,
        badge: 'Nuevo'
    },
    {
        id: 'italiano-conversacion',
        language: 'italiano',
        title: 'Taller de Conversación',
        level: 'Intermedio/Avanzado',
        description: 'Perfecciona tu fluidez y vocabulario discutiendo temas de actualidad y cultura.',
        features: ['100% Práctico', 'Debates en grupo', 'Cine y Literatura'],
        schedule: 'Viernes 19:00hs',
        highlight: false,
    },
    {
        id: 'ingles-general',
        language: 'ingles',
        title: 'Inglés Práctico',
        level: 'Todos los niveles',
        description: 'Enfoque comunicativo para desenvolverse en situaciones reales de viaje y trabajo.',
        features: ['Speaking intensivo', 'Situaciones reales', 'Material digital'],
        schedule: 'Lunes y Miércoles 19:00hs',
        highlight: false,
    }
];

export const CourseList = component$(() => {
    return (
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((course) => (
                <Card key={course.id} class={`flex flex-col h-full transition-all duration-300 hover:shadow-lg ${course.highlight ? 'border-green-500 shadow-md ring-1 ring-green-500 bg-green-50/30' : 'hover:border-green-200'}`}>
                    <CardHeader class="pb-2">
                        <div class="flex justify-between items-start mb-2">
                            <span class={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${course.language === 'italiano' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {course.language}
                            </span>
                            {course.badge && (
                                <span class="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 animate-pulse">
                                    {course.badge}
                                </span>
                            )}
                        </div>
                        <CardTitle class="text-xl text-gray-900">{course.title}</CardTitle>
                        <p class="text-sm text-gray-500 font-medium">{course.level}</p>
                    </CardHeader>
                    <CardContent class="flex-grow">
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                            {course.description}
                        </p>
                        <ul class="space-y-2 mb-4">
                            {course.features.map((feature, idx) => (
                                <li key={idx} class="flex items-center text-sm text-gray-500">
                                    <LuCheck class={`w-4 h-4 mr-2 ${course.highlight ? 'text-green-600' : 'text-gray-400'}`} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div class="text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                            🕐 {course.schedule}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant={course.highlight ? 'primary' : 'outline'}
                            fullWidth
                            onClick$={() => {
                                document.getElementById('inscription-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Ver más <LuArrowRight class="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
});
