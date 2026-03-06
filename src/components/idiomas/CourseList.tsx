import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { LuCheck, LuArrowRight } from "@qwikest/icons/lucide";

export const COURSES = [
  {
    id: "italiano-1-inicial",
    language: "italiano",
    title: "1º Inicial",
    level: "Nivel A1",
    description:
      "Ideal para quienes comienzan desde cero. Aprenderás las bases del idioma y la cultura.",
    features: ["Gramática esencial", "Fonética básica", "Cultura general"],
    schedule: "Viernes 17:30 a 19:30 hs",
    teacher: "Prof. Luciano Giacommi",
    highlight: true,
    badge: "Destacado",
  },
  {
    id: "italiano-2-intermedio",
    language: "italiano",
    title: "Intermedio 2º",
    level: "Nivel A2",
    description:
      "Para quienes ya tienen conocimientos básicos. Profundiza en gramática y vocabulario.",
    features: ["Expresión oral", "Comprensión auditiva", "Lectura guiada"],
    schedule: "Miércoles y Jueves 16:45 a 18:15 hs",
    teacher: "Prof. Luciano Giacommi",
    highlight: false,
  },
  {
    id: "italiano-3-cittadinanza",
    language: "italiano",
    title: "Cittadinanza 3º",
    level: "Nivel B1 (Preparación)",
    description:
      "Enfocado en los requisitos lingüísticos para tramitar la ciudadanía italiana.",
    features: ["Vocabulario específico", "Práctica de exámenes", "Cultura cívica"],
    schedule: "Lunes 16:45 a 18:15 hs | Jueves 15:00 a 16:30 hs",
    teacher: "Prof. Luciano Giacommi",
    highlight: false,
  },
  {
    id: "italiano-4-cittadinanza-avanzado",
    language: "italiano",
    title: "Cittadinanza Avanzado 4º",
    level: "Nivel B1+ (Avanzado)",
    description:
      "Nivel avanzado con enfoque en la preparación exhaustiva para obtener la ciudadanía.",
    features: ["Simulacros de examen", "Producción escrita", "Fluidez oral"],
    schedule: "Lunes y Miércoles 15:00 a 16:30 hs",
    teacher: "Prof. Luciano Giacommi",
    highlight: false,
  },
  {
    id: "italiano-conversazione",
    language: "italiano",
    title: "Conversazione",
    level: "Intermedio/Avanzado",
    description:
      "Perfecciona tu fluidez y vocabulario discutiendo temas de actualidad y cultura.",
    features: ["100% Práctico", "Debates en grupo", "Cultura italiana"],
    schedule: "Martes y Viernes 15:15 a 16:45 hs",
    teacher: "Prof.ssa Sandra Beraldo",
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
    schedule: "Próximamente",
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
    schedule: "Próximamente",
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
            <div class="mt-auto border-t border-gray-100 pt-3 space-y-1.5">
              <div class="flex items-start text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1.5 h-3.5 w-3.5 shrink-0 mt-0.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{course.schedule}</span>
              </div>
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
