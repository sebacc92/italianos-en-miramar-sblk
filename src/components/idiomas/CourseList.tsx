import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { LuArrowRight } from "@qwikest/icons/lucide";

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
}

export const CourseList = component$<CourseListProps>(({ courses }) => {
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
                <div class="mt-4 rounded-xl bg-gray-50 p-4">
                  <div class="flex justify-between items-center text-sm border-b border-gray-200 pb-2 mb-2">
                    <span class="text-gray-500">Socios</span>
                    <span class="font-bold text-green-700">${course.precio_socio}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm border-b border-gray-200 pb-2 mb-2">
                    <span class="text-gray-500">No Socios</span>
                    <span class="font-bold text-gray-900">${course.precio_no_socio}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500">Inscripción</span>
                    <span class="font-semibold text-gray-700">${course.precio_inscripcion}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <Button
                variant="outline"
                fullWidth
                onClick$={() => {
                  document
                    .getElementById("inscription-form")
                    ?.scrollIntoView({ behavior: "smooth" });
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
