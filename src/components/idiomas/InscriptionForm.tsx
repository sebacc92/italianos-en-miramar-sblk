import { component$ } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import { Select } from "~/components/ui/Select";
import { Card } from "~/components/ui/card/card";
import { LuSend, LuCheckCircle } from "@qwikest/icons/lucide";
import { COURSES } from "./CourseList";

interface InscriptionFormProps {
  action: ActionStore<any, any>;
}

export const InscriptionForm = component$<InscriptionFormProps>(
  ({ action }) => {
    // Opciones para el select basadas en los cursos disponibles
    const courseOptions = COURSES.map((c) => ({
      label: `${c.title} (${c.schedule})`,
      value: c.id,
    }));

    return (
      <Card.Root class="mx-auto w-full max-w-2xl border-t-4 border-t-green-600 shadow-xl">
        <Card.Header class="pb-2 text-center">
          <Card.Title class="text-2xl text-gray-800 md:text-3xl">
            Asegura tu vacante
          </Card.Title>
          <Card.Description>
            Completa tus datos para pre-inscribirte al Ciclo Lectivo 2026.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {action.value?.success ? (
            <div class="animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-lg border border-green-100 bg-green-50 p-8 text-center duration-300">
              <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <LuCheckCircle class="h-8 w-8" />
              </div>
              <h3 class="mb-2 text-xl font-bold text-green-800">
                ¡Solicitud Enviada!
              </h3>
              <p class="mb-6 text-green-700">
                Hemos recibido tus datos correctamente. Te contactaremos por
                WhatsApp a la brevedad para confirmar tu inscripción.
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
                <div class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {action.value.message}
                </div>
              )}

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="name">Nombre y Apellido</Label>
                  <Input name="name" id="name" placeholder="Ej: Juan Pérez" />
                  {action.value?.fieldErrors?.name && (
                    <p class="mt-1 text-xs text-red-600">
                      {action.value.fieldErrors.name}
                    </p>
                  )}
                </div>
                <div class="space-y-2">
                  <Label for="phone">Teléfono (WhatsApp)</Label>
                  <Input
                    name="phone"
                    id="phone"
                    type="tel"
                    placeholder="Ej: 2291 123456"
                  />
                  {action.value?.fieldErrors?.phone && (
                    <p class="mt-1 text-xs text-red-600">
                      {action.value.fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div class="space-y-2">
                <Label for="email">Email de contacto</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                />
                {action.value?.fieldErrors?.email && (
                  <p class="mt-1 text-xs text-red-600">
                    {action.value.fieldErrors.email}
                  </p>
                )}
              </div>

              <div class="space-y-2">
                <Label for="course">Curso de interés</Label>
                <Select name="course" id="course" options={courseOptions} />
                {action.value?.fieldErrors?.course && (
                  <p class="mt-1 text-xs text-red-600">
                    {action.value.fieldErrors.course}
                  </p>
                )}
              </div>

              <div class="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  disabled={action.isRunning}
                  class="h-12 text-base"
                >
                  {action.isRunning ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Pre-inscripción <LuSend class="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p class="mt-4 text-center text-xs text-gray-500">
                  * La pre-inscripción no garantiza la vacante hasta confirmar
                  el pago de la matrícula.
                </p>
              </div>
            </Form>
          )}
        </Card.Content>
      </Card.Root>
    );
  },
);
