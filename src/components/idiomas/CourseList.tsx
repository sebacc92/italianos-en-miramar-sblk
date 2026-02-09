import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { LuCheck, LuArrowRight } from "@qwikest/icons/lucide";

export const COURSES = [
  {
    id: "italiano-inicial",
    language: "italiano",
    title: "Italiano Inicial",
    level: "Nivel A1",
    description:
      "Ideal para quienes comienzan desde cero. Aprenderás las bases del idioma y la cultura.",
    features: ["Gramática esencial", "Fonética básica", "Cultura general"],
    schedule: "Martes y Jueves 18:00hs",
    highlight: false,
  },
  {
    id: "italiano-infantil",
    language: "italiano",
    title: "Italiano Infantil",
    level: "Niños 6-12 años",
    description:
      "Un espacio lúdico para aprender jugando. Canciones, juegos y primeros pasos en el idioma.",
    features: [
      "Juegos interactivos",
      "Canciones tradicionales",
      "Aprendizaje natural",
    ],
    schedule: "Sábados 10:00hs",
    highlight: true,
    badge: "Nuevo",
  },
  {
    id: "italiano-conversacion",
    language: "italiano",
    title: "Taller de Conversación",
    level: "Intermedio/Avanzado",
    description:
      "Perfecciona tu fluidez y vocabulario discutiendo temas de actualidad y cultura.",
    features: ["100% Práctico", "Debates en grupo", "Cine y Literatura"],
    schedule: "Viernes 19:00hs",
    highlight: false,
  },
  {
    id: "ingles-general",
    language: "ingles",
    title: "Inglés Práctico",
    level: "Todos los niveles",
    description:
      "Enfoque comunicativo para desenvolverse en situaciones reales de viaje y trabajo.",
    features: ["Speaking intensivo", "Situaciones reales", "Material digital"],
    schedule: "Lunes y Miércoles 19:00hs",
    highlight: false,
  },
];

export const CourseList = component$(() => {
  return (
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {COURSES.map((course) => (
        <Card.Root
          key={course.id}
          class={`flex h-full flex-col transition-all duration-300 hover:shadow-lg ${course.highlight ? "border-green-500 bg-green-50/30 shadow-md ring-1 ring-green-500" : "hover:border-green-200"}`}
        >
          <Card.Header class="pb-2">
            <div class="mb-2 flex items-start justify-between">
              <span
                class={`rounded-full px-2 py-1 text-xs font-bold tracking-wider uppercase ${course.language === "italiano" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
              >
                {course.language}
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
            <ul class="mb-4 space-y-2">
              {course.features.map((feature, idx) => (
                <li key={idx} class="flex items-center text-sm text-gray-500">
                  <LuCheck
                    class={`mr-2 h-4 w-4 ${course.highlight ? "text-green-600" : "text-gray-400"}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <div class="mt-auto border-t border-gray-100 pt-2 text-xs text-gray-400">
              🕐 {course.schedule}
            </div>
          </Card.Content>
          <Card.Footer>
            <Button
              variant={course.highlight ? "primary" : "outline"}
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
      ))}
    </div>
  );
});
