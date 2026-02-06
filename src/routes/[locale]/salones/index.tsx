import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeAction$, zod$, z, Form } from '@builder.io/qwik-city';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select } from '~/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/Card';
import { LuCalendarCheck, LuMapPin, LuUsers, LuCheckCircle, LuSend } from '@qwikest/icons/lucide';
import { tursoClient } from '~/utils/turso';

export const useRentHall = routeAction$(async (data, requestEvent) => {
    try {
        const db = tursoClient(requestEvent);

        await db.execute({
            sql: `INSERT INTO reservas_salones (nombre, apellido, email, telefono, tipo_evento, salon, fecha_estimada, mensaje, estado) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            args: [
                data.nombre,
                data.apellido,
                data.email,
                data.telefono,
                data.tipo_evento,
                data.salon,
                data.fecha_estimada,
                data.mensaje || null
            ]
        });

        return {
            success: true,
            message: '¡Solicitud enviada! Te contactaremos a la brevedad para confirmar disponibilidad.'
        };
    } catch (e: any) {
        console.error('Error saving hall reservation:', e);
        return {
            success: false,
            message: 'Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.'
        };
    }
}, zod$({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    apellido: z.string().min(2, 'El apellido es obligatorio'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(8, 'Teléfono inválido'),
    tipo_evento: z.string().min(1, 'Selecciona un tipo de evento'),
    salon: z.string().min(1, 'Selecciona un salón'),
    fecha_estimada: z.string().min(1, 'Selecciona una fecha estimada'),
    mensaje: z.string().optional(),
}));

export default component$(() => {
    const action = useRentHall();

    const hallOptions = [
        { label: 'Salón Principal "Giuseppe Verdi" (150 personas)', value: 'giuseppe_verdi' },
        { label: 'Salón "Dante Alighieri" (50 personas)', value: 'dante_alighieri' },
    ];

    const eventTypeOptions = [
        { label: 'Cumpleaños / 15 Años', value: 'cumpleanos' },
        { label: 'Casamiento', value: 'casamiento' },
        { label: 'Evento Corporativo / Conferencia', value: 'corporativo' },
        { label: 'Reunión Familiar', value: 'reunion' },
        { label: 'Otro', value: 'otro' },
    ];

    return (
        <div class="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-hidden">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Alquiler de Salones
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Espacios versátiles e históricos para que tu evento sea inolvidable. Bodas, conferencias y celebraciones en el corazón de Miramar.
                    </p>
                    <Button
                        size="lg"
                        class="text-lg px-8 shadow-xl shadow-blue-900/20 bg-blue-600 hover:bg-blue-700 animate-in fade-in zoom-in duration-700 delay-300"
                        onClick$={() => {
                            document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Solicitar Presupuesto
                    </Button>
                </div>
            </section>

            {/* Halls List Section */}
            <section class="py-20 container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestros Espacios</h2>
                    <div class="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Contamos con opciones adaptadas a diferentes tipos de eventos y capacidades.
                    </p>
                </div>

                <div class="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto mb-16">
                    {/* Salón 1 */}
                    <Card class="overflow-hidden shadow-lg border-blue-100 hover:shadow-xl transition-shadow bg-white">
                        <div class="h-48 bg-gray-200 relative overflow-hidden group">
                            {/* Placeholder generic image since we don't have specifics yet. Using div with gradient. */}
                            <div class="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-100 flex items-center justify-center text-gray-400">
                                <span class="text-4xl">🏛️</span>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle class="text-2xl mb-2 text-blue-900">Salón Principal "Giuseppe Verdi"</CardTitle>
                            <CardDescription class="text-base">El escenario perfecto para grandes celebraciones.</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="flex items-center text-gray-600">
                                <LuUsers class="w-5 h-5 mr-3 text-blue-600" />
                                <span>Capacidad hasta 280 personas (Banquete)</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <LuMapPin class="w-5 h-5 mr-3 text-blue-600" />
                                <span>Planta Baja - Accesible</span>
                            </div>
                            <p class="text-gray-600 leading-relaxed mt-4">
                                Un salón histórico con techos altos, escenario teatral y excelente acústica. Ideal para casamientos, fiestas de 15, cenas show y actos protocolares.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Salón 2 */}
                    <Card class="overflow-hidden shadow-lg border-blue-100 hover:shadow-xl transition-shadow bg-white">
                        <div class="h-48 bg-gray-200 relative overflow-hidden">
                            <div class="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-100 flex items-center justify-center text-gray-400">
                                <span class="text-4xl">🎓</span>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle class="text-2xl mb-2 text-blue-900">Salón "Dante Alighieri"</CardTitle>
                            <CardDescription class="text-base">Intimidad y funcionalidad para eventos medianos.</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="flex items-center text-gray-600">
                                <LuUsers class="w-5 h-5 mr-3 text-blue-600" />
                                <span>Capacidad hasta 90 personas</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <LuMapPin class="w-5 h-5 mr-3 text-blue-600" />
                                <span>Primer Piso</span>
                            </div>
                            <p class="text-gray-600 leading-relaxed mt-4">
                                Espacio luminoso y versátil. Perfecto para conferencias, cursos, reuniones corporativas, cumpleaños infantiles o reuniones familiares privadas.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Booking Form Section */}
            <section id="booking-form" class="py-20 bg-blue-900/5 relative">
                <div class="container mx-auto px-4 max-w-3xl">
                    <Card class="shadow-2xl border-t-4 border-t-blue-600">
                        <CardHeader class="text-center">
                            <CardTitle class="text-3xl font-bold text-gray-800">Solicita tu Reserva</CardTitle>
                            <CardDescription class="text-lg">
                                Completa el formulario y verificaremos la disponibilidad para tu fecha.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {action.value?.success ? (
                                <div class="text-center py-12 animate-in fade-in zoom-in duration-300">
                                    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <LuCheckCircle class="w-10 h-10" />
                                    </div>
                                    <h3 class="text-2xl font-bold text-green-800 mb-3">¡Consulta Enviada!</h3>
                                    <p class="text-green-700 mb-8 max-w-md mx-auto">
                                        {action.value.message}
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick$={() => window.location.reload()}
                                    >
                                        Hacer otra consulta
                                    </Button>
                                </div>
                            ) : (
                                <Form action={action} class="space-y-6">
                                    {action.value?.message && !action.value.success && (
                                        <div class="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                                            {action.value.message}
                                        </div>
                                    )}

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="nombre">Nombre</Label>
                                            <Input name="nombre" id="nombre" placeholder="Tu nombre" />
                                            {action.value?.fieldErrors?.nombre && <p class="text-xs text-red-600">{action.value.fieldErrors.nombre}</p>}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="apellido">Apellido</Label>
                                            <Input name="apellido" id="apellido" placeholder="Tu apellido" />
                                            {action.value?.fieldErrors?.apellido && <p class="text-xs text-red-600">{action.value.fieldErrors.apellido}</p>}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="email">Email</Label>
                                            <Input name="email" id="email" type="email" placeholder="email@ejemplo.com" />
                                            {action.value?.fieldErrors?.email && <p class="text-xs text-red-600">{action.value.fieldErrors.email}</p>}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="telefono">Teléfono / WhatsApp</Label>
                                            <Input name="telefono" id="telefono" type="tel" placeholder="2291..." />
                                            {action.value?.fieldErrors?.telefono && <p class="text-xs text-red-600">{action.value.fieldErrors.telefono}</p>}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="salon">Salón de Interés</Label>
                                            <Select name="salon" id="salon" options={hallOptions} placeholder="Selecciona un salón" />
                                            {action.value?.fieldErrors?.salon && <p class="text-xs text-red-600">{action.value.fieldErrors.salon}</p>}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="tipo_evento">Tipo de Evento</Label>
                                            <Select name="tipo_evento" id="tipo_evento" options={eventTypeOptions} placeholder="Ej: Cumpleaños" />
                                            {action.value?.fieldErrors?.tipo_evento && <p class="text-xs text-red-600">{action.value.fieldErrors.tipo_evento}</p>}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="fecha_estimada">Fecha Estimada</Label>
                                            <div class="relative">
                                                <Input name="fecha_estimada" id="fecha_estimada" type="date" class="pl-10" />
                                                <LuCalendarCheck class="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                            </div>
                                            {action.value?.fieldErrors?.fecha_estimada && <p class="text-xs text-red-600">{action.value.fieldErrors.fecha_estimada}</p>}
                                        </div>
                                        <div class="space-y-2">
                                            {/* Empty placeholder to align grid if needed, or add more fields */}
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <Label for="mensaje">Comentarios Adicionales (Opcional)</Label>
                                        <textarea
                                            name="mensaje"
                                            id="mensaje"
                                            rows={3}
                                            class="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Cuéntanos más sobre tu evento..."
                                        />
                                        {action.value?.fieldErrors?.mensaje && <p class="text-xs text-red-600">{action.value.fieldErrors.mensaje}</p>}
                                    </div>

                                    <div class="pt-4">
                                        <Button type="submit" fullWidth disabled={action.isRunning} class="bg-blue-600 hover:bg-blue-700 h-12 text-base">
                                            {action.isRunning ? 'Enviando Solicitud...' : (
                                                <>
                                                    Enviar Consulta <LuSend class="ml-2 w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Alquiler de Salones - Círculo Italiano Miramar',
    meta: [
        {
            name: 'description',
            content: 'Alquiler de salones para eventos en Miramar. Salón Giuseppe Verdi y Dante Alighieri. Ideales para casamientos, conferencias y fiestas.',
        },
    ],
};
