import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { LuCheck, LuArrowRight } from "@qwikest/icons/lucide";

interface CourseListProps {
  courses: Array<{
    id: number;
    title: string;
    courseLanguage: string;
    level: string;
    description: string;
    features: any; // We expect string[] or parsed JSON
    schedule?: string | null;
    teacher?: string | null;
    isHighlight?: boolean | null;
    badge?: string | null;
  }>;
}

export const CourseList = component$<CourseListProps>(({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div class="py-12 text-center text-gray-500">
        <h3 class="mb-2 text-xl font-bold">Aún no hay cursos disponibles en este idioma</h3>
        <p>Estamos planificando los nuevos cronogramas. ¡Vuelve pronto!</p>
      </div>
    );
  }

  return (
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {courses.map((course) => {
        // Parse features safely if it's stored as JSON string
        let featureList: string[] = [];
        if (Array.isArray(course.features)) {
          featureList = course.features;
        } else if (typeof course.features === "string") {
          try {
            featureList = JSON.parse(course.features);
            if (!Array.isArray(featureList)) featureList = [course.features];
          } catch {
            featureList = [course.features];
          }
        }

        return (
          <Card.Root
            key={course.id}
            class={`flex h-full flex-col transition-all duration-300 hover:shadow-lg ${course.isHighlight ? "border-green-500 bg-green-50/30 shadow-md ring-1 ring-green-500" : "hover:border-green-200"}`}
          >
            <Card.Header class="pb-2">
              <div class="mb-2 flex items-start justify-between">
                <span
                  class={`rounded-full px-2 py-1 text-xs font-bold tracking-wider uppercase ${course.courseLanguage.toLowerCase().includes("italiano") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                >
                  {course.courseLanguage}
                </span>
                {course.badge && (
                  <span class="animate-pulse rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
                    {course.badge}
                  </span>
                )}
              </div>
              <Card.Title class="text-xl text-gray-900">
                {course.title}
              </Card.Title>
              <p class="text-sm font-medium text-gray-500">{course.level}</p>
            </Card.Header>
            <Card.Content class="flex-grow">
              <p class="mb-4 text-sm leading-relaxed text-gray-600">
                {course.description}
              </p>
              {featureList.length > 0 && (
                <ul class="mb-4 space-y-2">
                  {featureList.map((feature, idx) => (
                    <li key={idx} class="flex items-center text-sm text-gray-500">
                      <LuCheck
                        class={`mr-2 h-4 w-4 ${course.isHighlight ? "text-green-600" : "text-gray-400"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div class="mt-auto border-t border-gray-100 pt-3 space-y-1.5">
                {course.schedule && (
                  <div class="flex items-start text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1.5 h-3.5 w-3.5 shrink-0 mt-0.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{course.schedule}</span>
                  </div>
                )}
                {course.teacher && (
                  <div class="flex items-start text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1.5 h-3.5 w-3.5 shrink-0 mt-0.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>{course.teacher}</span>
                  </div>
                )}
              </div>
            </Card.Content>
            <Card.Footer>
              <Button
                variant={course.isHighlight ? "primary" : "outline"}
                fullWidth
                onClick$={() => {
                  document
                    .getElementById("inscription-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver más <LuArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </Card.Footer>
          </Card.Root>
        );
      })}
    </div>
  );
});
