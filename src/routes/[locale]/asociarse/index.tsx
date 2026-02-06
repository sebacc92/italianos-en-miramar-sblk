import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeAction$, zod$, z, Form } from '@builder.io/qwik-city';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select } from '~/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/Card';
import { LuCheckCircle, LuSend, LuUser, LuMail, LuPhone, LuMapPin } from '@qwikest/icons/lucide';
import { tursoClient } from '~/utils/turso';
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";

export const useSubmitMembership = routeAction$(async (data, requestEvent) => {
    try {
        const db = tursoClient(requestEvent);

        await db.execute({
            sql: `INSERT INTO solicitudes_asociacion 
                  (nombre, apellido, dni, fecha_nacimiento, nacionalidad, email, telefono, 
                   domicilio, ciudad, codigo_postal, profesion, estado_civil, 
                   tiene_ascendencia_italiana, socio_presentante_1, socio_presentante_2, 
                   motivo_asociacion, estado) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            args: [
                data.nombre,
                data.apellido,
                data.dni,
                data.fecha_nacimiento,
                data.nacionalidad,
                data.email,
                data.telefono,
                data.domicilio,
                data.ciudad,
                data.codigo_postal || null,
                data.profesion,
                data.estado_civil,
                data.tiene_ascendencia_italiana ? 1 : 0,
                data.socio_presentante_1 || null,
                data.socio_presentante_2 || null,
                data.motivo_asociacion
            ]
        });

        return {
            success: true,
            message: _`joinForm.successMessage`
        };
    } catch (e: any) {
        console.error('Error saving membership application:', e);

        // Handle duplicate entries
        if (e.message?.includes('UNIQUE constraint failed')) {
            if (e.message.includes('dni')) {
                return {
                    success: false,
                    message: 'Ya existe una solicitud con este DNI.'
                };
            }
            if (e.message.includes('email')) {
                return {
                    success: false,
                    message: 'Ya existe una solicitud con este email.'
                };
            }
        }

        return {
            success: false,
            message: _`joinForm.errorMessage`
        };
    }
}, zod$({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    apellido: z.string().min(2, 'El apellido es obligatorio'),
    dni: z.string().min(7, 'DNI inválido (mínimo 7 caracteres)'),
    fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
    nacionalidad: z.string().min(2, 'La nacionalidad es obligatoria'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(8, 'Teléfono inválido (mínimo 8 números)'),
    domicilio: z.string().min(5, 'El domicilio es obligatorio'),
    ciudad: z.string().min(2, 'La ciudad es obligatoria'),
    codigo_postal: z.string().optional(),
    profesion: z.string().min(2, 'La profesión es obligatoria'),
    estado_civil: z.string().min(1, 'El estado civil es obligatorio'),
    tiene_ascendencia_italiana: z.string().optional().transform(val => val === 'on'),
    socio_presentante_1: z.string().optional(),
    socio_presentante_2: z.string().optional(),
    motivo_asociacion: z.string().min(20, 'Por favor describe tu motivación (mínimo 20 caracteres)'),
}));

export default component$(() => {
    const action = useSubmitMembership();

    const estadoCivilOptions = [
        { label: _`joinForm.estadoCivil.soltero`, value: 'soltero' },
        { label: _`joinForm.estadoCivil.casado`, value: 'casado' },
        { label: _`joinForm.estadoCivil.divorciado`, value: 'divorciado' },
        { label: _`joinForm.estadoCivil.viudo`, value: 'viudo' },
        { label: _`joinForm.estadoCivil.otro`, value: 'otro' },
    ];

    return (
        <div class="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white overflow-hidden">
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {_`joinForm.hero.title`}
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        {_`joinForm.hero.subtitle`}
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section class="py-20 container mx-auto px-4 max-w-4xl">
                <Card class="shadow-2xl border-t-4 border-t-green-600">
                    <CardHeader class="text-center">
                        <CardTitle class="text-3xl font-bold text-gray-800">
                            {_`joinForm.hero.title`}
                        </CardTitle>
                        <CardDescription class="text-lg">
                            {_`joinForm.hero.subtitle`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {action.value?.success ? (
                            <div class="text-center py-12 animate-in fade-in zoom-in duration-300">
                                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LuCheckCircle class="w-10 h-10" />
                                </div>
                                <h3 class="text-2xl font-bold text-green-800 mb-3">
                                    {_`joinForm.successTitle`}
                                </h3>
                                <p class="text-green-700 mb-8 max-w-md mx-auto">
                                    {action.value.message}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick$={() => window.location.reload()}
                                >
                                    {_`joinForm.newRequest`}
                                </Button>
                            </div>
                        ) : (
                            <Form action={action} class="space-y-8">
                                {action.value?.message && !action.value.success && (
                                    <div class="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                                        {action.value.message}
                                    </div>
                                )}

                                {/* Datos Personales */}
                                <div class="space-y-6">
                                    <div class="flex items-center gap-2 border-b pb-2">
                                        <LuUser class="w-5 h-5 text-green-600" />
                                        <h3 class="text-xl font-semibold text-gray-800">
                                            {_`joinForm.personalData`}
                                        </h3>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="nombre">{_`joinForm.nombre`}</Label>
                                            <Input name="nombre" id="nombre" placeholder="Juan" required />
                                            {action.value?.fieldErrors?.nombre && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.nombre}</p>
                                            )}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="apellido">{_`joinForm.apellido`}</Label>
                                            <Input name="apellido" id="apellido" placeholder="Pérez" required />
                                            {action.value?.fieldErrors?.apellido && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.apellido}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="dni">{_`joinForm.dni`}</Label>
                                            <Input name="dni" id="dni" placeholder="12345678" required />
                                            {action.value?.fieldErrors?.dni && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.dni}</p>
                                            )}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="fecha_nacimiento">{_`joinForm.fechaNacimiento`}</Label>
                                            <Input name="fecha_nacimiento" id="fecha_nacimiento" type="date" required />
                                            {action.value?.fieldErrors?.fecha_nacimiento && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.fecha_nacimiento}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <Label for="nacionalidad">{_`joinForm.nacionalidad`}</Label>
                                        <Input name="nacionalidad" id="nacionalidad" placeholder="Argentina" required />
                                        {action.value?.fieldErrors?.nacionalidad && (
                                            <p class="text-xs text-red-600">{action.value.fieldErrors.nacionalidad}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Datos de Contacto */}
                                <div class="space-y-6">
                                    <div class="flex items-center gap-2 border-b pb-2">
                                        <LuMail class="w-5 h-5 text-green-600" />
                                        <h3 class="text-xl font-semibold text-gray-800">
                                            {_`joinForm.contact`}
                                        </h3>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="email">{_`joinForm.email`}</Label>
                                            <Input name="email" id="email" type="email" placeholder="ejemplo@email.com" required />
                                            {action.value?.fieldErrors?.email && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.email}</p>
                                            )}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="telefono">{_`joinForm.telefono`}</Label>
                                            <Input name="telefono" id="telefono" type="tel" placeholder="2291..." required />
                                            {action.value?.fieldErrors?.telefono && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.telefono}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="space-y-2">
                                        <Label for="domicilio">{_`joinForm.domicilio`}</Label>
                                        <Input name="domicilio" id="domicilio" placeholder="Calle 123" required />
                                        {action.value?.fieldErrors?.domicilio && (
                                            <p class="text-xs text-red-600">{action.value.fieldErrors.domicilio}</p>
                                        )}
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="ciudad">{_`joinForm.ciudad`}</Label>
                                            <Input name="ciudad" id="ciudad" placeholder="Miramar" required />
                                            {action.value?.fieldErrors?.ciudad && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.ciudad}</p>
                                            )}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="codigo_postal">{_`joinForm.codigoPostal`}</Label>
                                            <Input name="codigo_postal" id="codigo_postal" placeholder="7607" />
                                        </div>
                                    </div>
                                </div>

                                {/* Información Adicional */}
                                <div class="space-y-6">
                                    <div class="flex items-center gap-2 border-b pb-2">
                                        <LuMapPin class="w-5 h-5 text-green-600" />
                                        <h3 class="text-xl font-semibold text-gray-800">
                                            {_`joinForm.additional`}
                                        </h3>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="profesion">{_`joinForm.profesion`}</Label>
                                            <Input name="profesion" id="profesion" placeholder="Ingeniero" required />
                                            {action.value?.fieldErrors?.profesion && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.profesion}</p>
                                            )}
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="estado_civil">{_`joinForm.estadoCivil`}</Label>
                                            <Select name="estado_civil" id="estado_civil" options={estadoCivilOptions} placeholder="Selecciona..." required />
                                            {action.value?.fieldErrors?.estado_civil && (
                                                <p class="text-xs text-red-600">{action.value.fieldErrors.estado_civil}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="tiene_ascendencia_italiana"
                                            id="tiene_ascendencia_italiana"
                                            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <Label for="tiene_ascendencia_italiana" class="cursor-pointer">
                                            {_`joinForm.ascendenciaItaliana`}
                                        </Label>
                                    </div>
                                </div>

                                {/* Socios Presentantes */}
                                <div class="space-y-6">
                                    <div class="flex items-center gap-2 border-b pb-2">
                                        <LuUser class="w-5 h-5 text-green-600" />
                                        <h3 class="text-xl font-semibold text-gray-800">
                                            {_`joinForm.presenters`}
                                        </h3>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label for="socio_presentante_1">{_`joinForm.socioPresentante1`}</Label>
                                            <Input name="socio_presentante_1" id="socio_presentante_1" placeholder="Nombre completo" />
                                        </div>
                                        <div class="space-y-2">
                                            <Label for="socio_presentante_2">{_`joinForm.socioPresentante2`}</Label>
                                            <Input name="socio_presentante_2" id="socio_presentante_2" placeholder="Nombre completo" />
                                        </div>
                                    </div>
                                </div>

                                {/* Motivación */}
                                <div class="space-y-6">
                                    <div class="flex items-center gap-2 border-b pb-2">
                                        <LuPhone class="w-5 h-5 text-green-600" />
                                        <h3 class="text-xl font-semibold text-gray-800">
                                            {_`joinForm.motivation`}
                                        </h3>
                                    </div>

                                    <div class="space-y-2">
                                        <Label for="motivo_asociacion">{_`joinForm.motivoAsociacion`}</Label>
                                        <textarea
                                            name="motivo_asociacion"
                                            id="motivo_asociacion"
                                            rows={4}
                                            class="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Cuéntanos por qué quieres ser parte del Círculo Italiano..."
                                            required
                                        />
                                        {action.value?.fieldErrors?.motivo_asociacion && (
                                            <p class="text-xs text-red-600">{action.value.fieldErrors.motivo_asociacion}</p>
                                        )}
                                    </div>
                                </div>

                                <div class="pt-4">
                                    <Button type="submit" fullWidth disabled={action.isRunning} class="bg-green-600 hover:bg-green-700 h-12 text-base">
                                        {action.isRunning ? _`joinForm.submitting` : (
                                            <>
                                                {_`joinForm.submit`} <LuSend class="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
});

export const head: DocumentHead = {
    title: _`joinForm.metaTitle`,
    meta: [
        {
            name: 'description',
            content: _`joinForm.metaDescription`,
        },
    ],
};

export const onStaticGenerate = generateI18nPaths;
