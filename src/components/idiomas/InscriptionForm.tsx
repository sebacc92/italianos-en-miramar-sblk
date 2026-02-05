import { component$ } from '@builder.io/qwik';
import { Form, type ActionStore } from '@builder.io/qwik-city';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select } from '~/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/Card';
import { LuSend, LuCheckCircle } from '@qwikest/icons/lucide';
import { COURSES } from './CourseList';

interface InscriptionFormProps {
    action: ActionStore<any, any>;
}

export const InscriptionForm = component$<InscriptionFormProps>(({ action }) => {
    // Opciones para el select basadas en los cursos disponibles
    const courseOptions = COURSES.map(c => ({
        label: `${c.title} (${c.schedule})`,
        value: c.id
    }));

    return (
        <Card class="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-green-600">
            <CardHeader class="text-center pb-2">
                <CardTitle class="text-2xl md:text-3xl text-gray-800">Asegura tu vacante</CardTitle>
                <CardDescription>
                    Completa tus datos para pre-inscribirte al Ciclo Lectivo 2026.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {action.value?.success ? (
                    <div class="flex flex-col items-center justify-center p-8 text-center bg-green-50 rounded-lg border border-green-100 animate-in fade-in zoom-in duration-300">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <LuCheckCircle class="w-8 h-8" />
                        </div>
                        <h3 class="text-xl font-bold text-green-800 mb-2">¡Solicitud Enviada!</h3>
                        <p class="text-green-700 mb-6">
                            Hemos recibido tus datos correctamente. Te contactaremos por WhatsApp a la brevedad para confirmar tu inscripción.
                        </p>
                        <Button
                            variant="outline"
                            onClick$={() => window.location.reload()}
                        >
                            Inscribir a otra persona
                        </Button>
                    </div>
                ) : (
                    <Form action={action} class="space-y-6">
                        {action.value?.message && !action.value.success && (
                            <div class="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                                {action.value.message}
                            </div>
                        )}

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label for="name">Nombre y Apellido</Label>
                                <Input name="name" id="name" placeholder="Ej: Juan Pérez" />
                                {action.value?.fieldErrors?.name && (
                                    <p class="text-xs text-red-600 mt-1">{action.value.fieldErrors.name}</p>
                                )}
                            </div>
                            <div class="space-y-2">
                                <Label for="phone">Teléfono (WhatsApp)</Label>
                                <Input name="phone" id="phone" type="tel" placeholder="Ej: 2291 123456" />
                                {action.value?.fieldErrors?.phone && (
                                    <p class="text-xs text-red-600 mt-1">{action.value.fieldErrors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="email">Email de contacto</Label>
                            <Input name="email" id="email" type="email" placeholder="juan@ejemplo.com" />
                            {action.value?.fieldErrors?.email && (
                                <p class="text-xs text-red-600 mt-1">{action.value.fieldErrors.email}</p>
                            )}
                        </div>

                        <div class="space-y-2">
                            <Label for="course">Curso de interés</Label>
                            <Select
                                name="course"
                                id="course"
                                options={courseOptions}
                            />
                            {action.value?.fieldErrors?.course && (
                                <p class="text-xs text-red-600 mt-1">{action.value.fieldErrors.course}</p>
                            )}
                        </div>

                        <div class="pt-4">
                            <Button type="submit" fullWidth disabled={action.isRunning} class="h-12 text-base">
                                {action.isRunning ? 'Enviando...' : (
                                    <>
                                        Enviar Pre-inscripción <LuSend class="ml-2 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                            <p class="text-xs text-center text-gray-500 mt-4">
                                * La pre-inscripción no garantiza la vacante hasta confirmar el pago de la matrícula.
                            </p>
                        </div>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
});
