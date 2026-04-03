import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { LuArrowRight } from "@qwikest/icons/lucide";
import { type Signal } from "@builder.io/qwik";

interface CourseListProps {
  courses: Array<{
    id: number;
    nombre_curso: string;
    profesor: string;
    horarios: string;
    precio_socio: number;
    precio_no_socio: number;
    precio_inscripcion: number;
  }>;
  selectedCourseId?: Signal<string>;
  nameInputRef?: Signal<HTMLInputElement | undefined>;
}

export const CourseList = component$<CourseListProps>(({ courses, selectedCourseId, nameInputRef }) => {
  if (!courses || courses.length === 0) {
    return (
      <div class="py-12 text-center text-gray-500">
        <h3 class="mb-2 text-xl font-bold">Aún no hay cursos configurados</h3>
        <p>Estamos planificando los nuevos cronogramas. ¡Vuelve pronto!</p>
      </div>
    );
  }

  return (
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => {
        return (
          <Card.Root
            key={course.id}
            class="flex h-full flex-col transition-all duration-300 hover:shadow-lg hover:border-green-200"
          >
            <Card.Header class="pb-2 border-b border-gray-100">
              <Card.Title class="text-xl text-gray-900">
                {course.nombre_curso}
              </Card.Title>
            </Card.Header>
            <Card.Content class="flex-grow pt-4">
              <div class="space-y-3">
                {/* Profesor */}
                <div class="flex items-start text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 h-4 w-4 shrink-0 text-green-600 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span class="font-medium">Profesor:</span>
                  <span class="ml-1">{course.profesor}</span>
                </div>

                {/* Horarios */}
                <div class="flex items-start text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 h-4 w-4 shrink-0 text-green-600 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span class="font-medium">Horarios:</span>
                  <span class="ml-1">{course.horarios}</span>
                </div>
                
                {/* Precios */}
                <div class="mt-4 rounded-xl bg-gray-50 p-4 space-y-3">
                  <div class="flex flex-col border-b border-gray-200 pb-3 mb-2">
                    <span class="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Valores mensuales</span>
                    <div class="flex justify-between items-center bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-medium text-sm mb-2">
                      <span>Socios</span>
                      <span class="font-bold">${course.precio_socio}</span>
                    </div>
                    <div class="flex justify-between items-center bg-zinc-100 text-zinc-800 px-3 py-1.5 rounded-lg font-medium text-sm">
                      <span>No Socios</span>
                      <span class="font-bold">${course.precio_no_socio}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center text-sm px-1">
                    <span class="text-gray-500 font-medium">Inscripción anual</span>
                    <span class="font-bold text-gray-700">${course.precio_inscripcion}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <Button
                variant="outline"
                fullWidth
                onClick$={() => {
                  if (selectedCourseId) {
                    selectedCourseId.value = String(course.id);
                  }
                  document
                    .getElementById("inscription-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                  
                  if (nameInputRef?.value) {
                    setTimeout(() => {
                      nameInputRef.value?.focus();
                    }, 100);
                  }
                }}
              >
                Inscribirse <LuArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </Card.Footer>
          </Card.Root>
        );
      })}
    </div>
  );
});
