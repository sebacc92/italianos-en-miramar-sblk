import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  LuClock,
  LuMapPin,
  LuUsers,
  LuArrowDown,
  LuMusic,
  LuHeart,
  LuInstagram,
  LuPhone,
  LuMail,
  LuAward,
  LuSparkles,
  LuShield,
} from "@qwikest/icons/lucide";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/button/button";
import { _ } from "compiled-i18n";
import { generateI18nPaths } from "~/utils/i18n-utils";

type ScheduleType =
  | "urban"
  | "jazz"
  | "yoga"
  | "kangoo"
  | "pilates"
  | "integral"
  | "ritmos"
  | "italiano"
  | "fusion"
  | "ensayo"
  | "dtm"
  | "exmov";

interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  room: string;
  type: ScheduleType;
  ageGroup?: string;
  level?: string;
}

const scheduleData: Record<string, ScheduleItem[]> = {
  lunes: [
    {
      id: "l1",
      name: "Juve 3 a 6 Urbano",
      time: "15:15 - 16:15",
      room: "Salón 1",
      type: "urban",
      ageGroup: "Juve 3 a 6",
    },
    {
      id: "l2",
      name: "Yoga",
      time: "15:30 - 16:30",
      room: "Salón 2",
      type: "yoga",
    },
    {
      id: "l3",
      name: "Juve 1 y 2 Urbano",
      time: "16:30 - 17:30",
      room: "Salón 1",
      type: "urban",
      ageGroup: "Juve 1 y 2",
    },
    {
      id: "l4",
      name: "Espacio para ensayar",
      time: "16:30 - 17:30",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "l5",
      name: "Espacio para ensayar",
      time: "18:30 - 19:30",
      room: "Salón 1",
      type: "ensayo",
    },
    {
      id: "l6",
      name: "Espacio para ensayar",
      time: "18:30 - 19:30",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "l7",
      name: "Inf 3 y 4 Ritmos",
      time: "18:30 - 19:30",
      room: "Aula 2",
      type: "ritmos",
      ageGroup: "Inf 3 y 4",
    },
    {
      id: "l8",
      name: "Inf 5 y 6 Ritmos",
      time: "19:30 - 20:30",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Inf 5 y 6",
    },
    {
      id: "l9",
      name: "Kangoo Jump",
      time: "19:30 - 20:30",
      room: "Salón 2",
      type: "kangoo",
    },
    {
      id: "l10",
      name: "Inf 5 y 6 Italiano",
      time: "19:00 - 19:30",
      room: "Aula 2",
      type: "italiano",
      ageGroup: "Inf 5 y 6",
    },
    {
      id: "l11",
      name: "+18 Ritmos",
      time: "20:30 - 21:30",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "+18",
    },
    {
      id: "l12",
      name: "Espacio para ensayar",
      time: "20:30 - 21:30",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "l13",
      name: "Inf 3 y 4 Italiano",
      time: "19:30 - 20:00",
      room: "Aula 2",
      type: "italiano",
      ageGroup: "Inf 3 y 4",
    },
  ],
  martes: [
    {
      id: "m1",
      name: "Acond. Integral",
      time: "09:00 - 10:00",
      room: "Salón 1",
      type: "integral",
    },
    {
      id: "m2",
      name: "+18 Ritmos",
      time: "15:00 - 16:00",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "+18",
    },
    {
      id: "m3",
      name: "Acond. Integral",
      time: "15:00 - 16:00",
      room: "Salón 2",
      type: "integral",
    },
    {
      id: "m4",
      name: "Juve 1 y 2 Ex.Mov.",
      time: "16:30 - 17:30",
      room: "Salón 1",
      type: "exmov",
      ageGroup: "Juve 1 y 2",
    },
    {
      id: "m5",
      name: "Espacio para ensayar",
      time: "16:30 - 17:30",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "m6",
      name: "Mini 3, 4 y 5",
      time: "17:30 - 18:15",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Mini 3, 4 y 5",
    },
    {
      id: "m7",
      name: "Mini 1 y 2 Ex.Mov.",
      time: "17:00 - 17:30",
      room: "Salón 2",
      type: "exmov",
      ageGroup: "Mini 1 y 2",
    },
    {
      id: "m8",
      name: "Juve 3 a 6 Jazz",
      time: "18:15 - 19:15",
      room: "Salón 1",
      type: "jazz",
      ageGroup: "Juve 3 a 6",
    },
    {
      id: "m9",
      name: "Inf 3 a 6 DTM",
      time: "18:15 - 20:15",
      room: "Salón 2",
      type: "dtm",
      ageGroup: "Inf 3 a 6",
    },
    {
      id: "m10",
      name: "Inf 1 y 2 Ritmos",
      time: "19:15 - 20:15",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Inf 1 y 2",
    },
    {
      id: "m11",
      name: "+18 Ex. del Mov.",
      time: "20:30 - 21:30",
      room: "Salón 1",
      type: "exmov",
      ageGroup: "+18",
    },
    {
      id: "m12",
      name: "Espacio para ensayar",
      time: "20:30 - 21:30",
      room: "Salón 2",
      type: "ensayo",
    },
  ],
  miercoles: [
    {
      id: "mi1",
      name: "Kangoo Jump",
      time: "09:00 - 10:00",
      room: "Salón 2",
      type: "kangoo",
    },
    {
      id: "mi2",
      name: "Pilates Fusión",
      time: "10:00 - 11:00",
      room: "Salón 1",
      type: "pilates",
    },
    {
      id: "mi3",
      name: "Yoga",
      time: "10:00 - 11:00",
      room: "Aula 2",
      type: "yoga",
    },
    {
      id: "mi4",
      name: "Juveniles Grupo Coreograf.",
      time: "15:30 - 17:00",
      room: "Salón 1",
      type: "urban",
      ageGroup: "Juveniles",
    },
    {
      id: "mi5",
      name: "Espacio para ensayar",
      time: "15:00 - 16:00",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "mi6",
      name: "+18 avanzado Jazz",
      time: "16:00 - 17:00",
      room: "Salón 2",
      type: "jazz",
      ageGroup: "+18",
      level: "avanzado",
    },
    {
      id: "mi7",
      name: "Juve 3 a 6 Ex.Mov.",
      time: "17:00 - 18:00",
      room: "Salón 1",
      type: "exmov",
      ageGroup: "Juve 3 a 6",
    },
    {
      id: "mi8",
      name: "Juve 1 y 2 Jazz",
      time: "17:15 - 18:15",
      room: "Salón 2",
      type: "jazz",
      ageGroup: "Juve 1 y 2",
    },
    {
      id: "mi9",
      name: "Inf 3 y 4 Urbano",
      time: "18:30 - 19:30",
      room: "Salón 1",
      type: "urban",
      ageGroup: "Inf 3 y 4",
    },
    {
      id: "mi10",
      name: "Juveniles DTM",
      time: "18:30 - 20:30",
      room: "Salón 2",
      type: "dtm",
      ageGroup: "Juveniles",
    },
    {
      id: "mi11",
      name: "Inf 5 y 6 Urbano",
      time: "19:30 - 20:30",
      room: "Salón 1",
      type: "urban",
      ageGroup: "Inf 5 y 6",
    },
    {
      id: "mi12",
      name: "+18 Jazz",
      time: "20:30 - 21:30",
      room: "Salón 1",
      type: "jazz",
      ageGroup: "+18",
    },
    {
      id: "mi13",
      name: "+18 Urbano",
      time: "20:30 - 21:30",
      room: "Salón 2",
      type: "urban",
      ageGroup: "+18",
    },
  ],
  jueves: [
    {
      id: "j1",
      name: "Acond. Integral",
      time: "09:00 - 10:00",
      room: "Salón 1",
      type: "integral",
    },
    {
      id: "j2",
      name: "Juve 3 a 6 Ritmos",
      time: "15:15 - 16:15",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Juve 3 a 6",
    },
    {
      id: "j3",
      name: "Acond. Integral",
      time: "15:00 - 16:00",
      room: "Salón 2",
      type: "integral",
    },
    {
      id: "j4",
      name: "Juve 1 y 2 Ritmos",
      time: "16:30 - 17:30",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Juve 1 y 2",
    },
    {
      id: "j5",
      name: "+18 avanzado Fusión",
      time: "16:00 - 17:00",
      room: "Salón 2",
      type: "fusion",
      ageGroup: "+18",
      level: "avanzado",
    },
    {
      id: "j6",
      name: "Mini 3, 4 y 5",
      time: "17:30 - 18:15",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "Mini 3, 4 y 5",
    },
    {
      id: "j7",
      name: "Espacio para ensayar",
      time: "17:30 - 18:15",
      room: "Salón 2",
      type: "ensayo",
    },
    {
      id: "j8",
      name: "Juve 3 a 6 Jazz",
      time: "18:15 - 19:15",
      room: "Salón 1",
      type: "jazz",
      ageGroup: "Juve 3 a 6",
    },
    {
      id: "j9",
      name: "Inf 1 y 2 DTM",
      time: "18:15 - 19:15",
      room: "Salón 2",
      type: "dtm",
      ageGroup: "Inf 1 y 2",
    },
    {
      id: "j10",
      name: "Juve 1 a 6 Fusión",
      time: "19:15 - 20:15",
      room: "Salón 1",
      type: "fusion",
      ageGroup: "Juve 1 a 6",
    },
    {
      id: "j11",
      name: "Inf 1 y 2 DTM + Ritmos",
      time: "19:15 - 20:15",
      room: "Salón 2",
      type: "dtm",
      ageGroup: "Inf 1 y 2",
    },
    {
      id: "j12",
      name: "+18 Ritmos",
      time: "20:30 - 21:30",
      room: "Salón 1",
      type: "ritmos",
      ageGroup: "+18",
    },
    {
      id: "j13",
      name: "Yoga",
      time: "20:30 - 21:30",
      room: "Salón 2",
      type: "yoga",
    },
  ],
  viernes: [
    {
      id: "v1",
      name: "Kangoo Jump",
      time: "09:00 - 10:00",
      room: "Salón 1",
      type: "kangoo",
    },
  ],
};

const typeClasses: Record<ScheduleType, string> = {
  urban: "bg-cyan-500 text-white",
  jazz: "bg-purple-500 text-white",
  yoga: "bg-orange-500 text-white",
  kangoo: "bg-green-500 text-white",
  pilates: "bg-green-600 text-white",
  integral: "bg-red-500 text-white",
  ritmos: "bg-yellow-400 text-black",
  italiano: "bg-blue-600 text-white",
  fusion: "bg-pink-500 text-white",
  ensayo: "bg-gray-400 text-white",
  dtm: "bg-blue-500 text-white",
  exmov: "bg-indigo-500 text-white",
};

const dayNames: Record<string, string> = {
  lunes: "LUNES",
  martes: "MARTES",
  miercoles: "MIÉRCOLES",
  jueves: "JUEVES",
  viernes: "VIERNES",
};

const dayOrder: Array<keyof typeof dayNames> = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
];

const Hero = component$(() => {
  const scrollToSchedule = $(() => {
    const el = document.getElementById("schedule");
    el?.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <section class="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50 md:min-h-screen">
      <style>
        {`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.04); }
          40% { transform: scale(1); }
          60% { transform: scale(1.06); }
          80% { transform: scale(1); }
        }
        .animate-heartbeat { animation: heartbeat 2.6s ease-in-out infinite; will-change: transform; }
        `}
      </style>
      <div class="relative z-10 container mx-auto px-4 text-center">
        <div class="mx-auto max-w-4xl">
          <div class="mb-8">
            <img
              src="/images/ritmos-en-accion/logo.png"
              alt="Ritmos en Acción"
              class="mx-auto mb-4 h-48 w-48 object-contain"
              width={256}
              height={256}
              loading="lazy"
            />
            <h1 class="text-primary animate-heartbeat mb-4 text-5xl leading-[0.95] font-bold tracking-tight md:text-7xl lg:text-8xl">
              <span class="block">RITMOS</span>
              <span class="block">EN ACCIÓN</span>
            </h1>
            <div class="text-muted-foreground animate-heartbeat mb-6 flex items-center justify-center gap-4 text-2xl md:text-3xl">
              <LuMusic class="h-8 w-8" />
              <span class="font-medium">{_`dance.hero.schoolType`}</span>
              <LuHeart class="h-8 w-8" />
            </div>
          </div>
          <blockquote class="text-foreground/80 mb-2 text-xl italic md:text-2xl">
            "{_`dance.hero.quote`}"
          </blockquote>
          <cite class="text-muted-foreground">- {_`dance.hero.author`}</cite>
          <div class="mt-12 mb-12">
            <p class="text-foreground/90 mx-auto max-w-3xl text-lg leading-relaxed md:text-xl">
              {_`dance.hero.description`}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              look="primary"
              class="px-8 py-6 text-lg"
              onClick$={scrollToSchedule}
            >
              <LuUsers class="mr-2 h-5 w-5" />
              {_`dance.hero.scheduleBtn`}
            </Button>
            <Button
              look="outline"
              class="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg"
              onClick$={() => window.open("https://wa.me/2235380187", "_blank")}
            >
              {_`dance.hero.contactBtn`}
            </Button>
          </div>
          <div class="mt-16 animate-bounce">
            <LuArrowDown class="text-muted-foreground mx-auto h-8 w-8" />
          </div>
        </div>
      </div>
    </section>
  );
});

const Values = component$(() => {
  const values = [
    {
      icon: LuAward,
      title: _`dance.values.professionalism.title`,
      description: _`dance.values.professionalism.desc`,
    },
    {
      icon: LuSparkles,
      title: _`dance.values.authenticity.title`,
      description: _`dance.values.authenticity.desc`,
    },
    {
      icon: LuHeart,
      title: _`dance.values.respect.title`,
      description: _`dance.values.respect.desc`,
    },
    {
      icon: LuShield,
      title: _`dance.values.containment.title`,
      description: _`dance.values.containment.desc`,
    },
    {
      icon: LuUsers,
      title: _`dance.values.belonging.title`,
      description: _`dance.values.belonging.desc`,
    },
  ];
  return (
    <section class="bg-card py-20">
      <div class="container mx-auto px-4">
        <div class="mb-16 text-center">
          <h2 class="text-primary mb-6 text-4xl font-bold md:text-5xl">{_`dance.values.title`}</h2>
          <p class="text-muted-foreground mx-auto max-w-2xl text-xl">{_`dance.values.subtitle`}</p>
        </div>
        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <Card.Root
              key={v.title}
              class="hover:border-primary/50 bg-background border-2 transition-all"
            >
              <Card.Content class="p-8 text-center">
                <div class="mb-6">
                  <div class="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <v.icon class="text-primary h-8 w-8" />
                  </div>
                  <h3 class="text-primary mb-4 text-xl font-bold">{v.title}</h3>
                </div>
                <p class="text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </div>
    </section>
  );
});

const Gallery = component$(() => {
  const images = Array.from({ length: 55 }, (_, i) => i + 1);
  const visibleCount = useSignal(10);
  const selectedImage = useSignal<number | null>(null);

  const showMore = $(() => {
    visibleCount.value = Math.min(visibleCount.value + 10, 55);
  });

  const openModal = $((num: number) => {
    selectedImage.value = num;
  });

  const closeModal = $(() => {
    selectedImage.value = null;
  });

  return (
    <section class="bg-background py-20">
      <div class="container mx-auto px-4">
        <div class="mb-16 text-center">
          <h2 class="text-primary mb-6 text-4xl font-bold md:text-5xl">{_`dance.gallery.title`}</h2>
          <p class="text-muted-foreground mx-auto max-w-2xl text-xl">{_`dance.gallery.subtitle`}</p>
        </div>
        <div class="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {images.slice(0, visibleCount.value).map((num) => (
            <div
              key={num}
              class="aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
              onClick$={() => openModal(num)}
            >
              <img
                src={`/images/ritmos-en-accion/${num}.jpeg`}
                alt={`Ritmos en Acción - Imagen ${num}`}
                class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {visibleCount.value < 55 && (
          <div class="mt-12 text-center">
            <Button look="outline" class="px-8 py-3" onClick$={showMore}>
              {_`dance.gallery.viewMore`} ({55 - visibleCount.value}{" "}
              {_`dance.gallery.remaining`})
            </Button>
          </div>
        )}

        {/* Modal */}
        {selectedImage.value && (
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick$={closeModal}
          >
            <div
              class="relative max-h-[90vh] w-full max-w-4xl"
              onClick$={(e) => e.stopPropagation()}
            >
              <button
                class="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                onClick$={closeModal}
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <img
                src={`/images/ritmos-en-accion/${selectedImage.value}.jpeg`}
                alt={`Ritmos en Acción - Imagen ${selectedImage.value}`}
                class="h-full w-full rounded-lg object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

const Schedule = component$(() => {
  const selectedClass = useSignal<ScheduleItem | null>(null);
  const onClose = $(() => (selectedClass.value = null));
  const expandedDays = useSignal<Set<string>>(new Set());

  const toggleDay = $((day: string) => {
    const newExpanded = new Set(expandedDays.value);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    expandedDays.value = newExpanded;
  });

  return (
    <section id="schedule" class="bg-green-50 py-20">
      <div class="container mx-auto px-4">
        <div class="mb-16 text-center">
          <div class="mb-16 text-center">
            <h2 class="text-primary mb-6 text-4xl font-bold md:text-5xl">{_`dance.schedule.title`}</h2>
            <p class="text-muted-foreground mx-auto max-w-2xl text-xl">{_`dance.schedule.subtitle`}</p>
          </div>
        </div>
        {/* Desktop Grid View - 5 columns */}
        <div class="mx-auto hidden max-w-7xl grid-cols-5 gap-6 xl:grid">
          {dayOrder.map((day) => {
            const classes = scheduleData[day] || [];
            return (
              <Card.Root key={day} class="rounded-xl bg-green-100/70 p-3">
                <Card.Header class="pb-3">
                  <Card.Title class="bg-primary rounded-lg py-2 text-center text-base font-bold text-white">
                    {dayNames[day]}
                  </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-2">
                  {classes.map((classItem) => (
                    <button
                      key={classItem.id}
                      class={`w-full rounded-lg p-3 text-left leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                      onClick$={() => (selectedClass.value = classItem)}
                    >
                      <div class="mb-1 text-sm font-semibold">
                        {classItem.name}
                      </div>
                      <div class="flex items-center gap-1 text-xs opacity-90">
                        <LuClock class="h-3 w-3" />
                        {classItem.time}
                      </div>
                      <div class="mt-1 flex items-center gap-1 text-xs opacity-90">
                        <LuMapPin class="h-3 w-3" />
                        {classItem.room}
                      </div>
                      {classItem.ageGroup && (
                        <div class="mt-1 flex items-center gap-1 text-xs opacity-90">
                          <LuUsers class="h-3 w-3" />
                          {classItem.ageGroup}
                        </div>
                      )}
                      {classItem.level && (
                        <span class="mt-1 inline-block rounded bg-white/85 px-2 py-0.5 text-[10px] text-black">
                          {classItem.level}
                        </span>
                      )}
                    </button>
                  ))}
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>

        {/* Tablet Grid View - 3 columns */}
        <div class="mx-auto hidden max-w-5xl grid-cols-3 gap-4 md:grid xl:hidden">
          {dayOrder.map((day) => {
            const classes = scheduleData[day] || [];
            return (
              <Card.Root key={day} class="rounded-xl bg-green-100/70 p-3">
                <Card.Header class="pb-3">
                  <Card.Title class="bg-primary rounded-lg py-2 text-center text-sm font-bold text-white">
                    {dayNames[day]}
                  </Card.Title>
                </Card.Header>
                <Card.Content class="space-y-2">
                  {classes.map((classItem) => (
                    <button
                      key={classItem.id}
                      class={`w-full rounded-lg p-2 text-left leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                      onClick$={() => (selectedClass.value = classItem)}
                    >
                      <div class="mb-1 text-xs font-semibold">
                        {classItem.name}
                      </div>
                      <div class="flex items-center gap-1 text-[10px] opacity-90">
                        <LuClock class="h-2 w-2" />
                        {classItem.time}
                      </div>
                      <div class="mt-1 flex items-center gap-1 text-[10px] opacity-90">
                        <LuMapPin class="h-2 w-2" />
                        {classItem.room}
                      </div>
                      {classItem.ageGroup && (
                        <div class="mt-1 flex items-center gap-1 text-[10px] opacity-90">
                          <LuUsers class="h-2 w-2" />
                          {classItem.ageGroup}
                        </div>
                      )}
                      {classItem.level && (
                        <span class="mt-1 inline-block rounded bg-white/85 px-1 py-0.5 text-[8px] text-black">
                          {classItem.level}
                        </span>
                      )}
                    </button>
                  ))}
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>

        {/* Mobile Accordion View */}
        <div class="mx-auto max-w-2xl space-y-4 md:hidden">
          {dayOrder.map((day) => {
            const classes = scheduleData[day] || [];
            const isExpanded = expandedDays.value.has(day);
            return (
              <Card.Root
                key={day}
                class="overflow-hidden rounded-xl bg-green-100/70"
              >
                <button
                  class="bg-primary flex w-full items-center justify-between p-4 text-left font-bold text-white"
                  onClick$={() => toggleDay(day)}
                >
                  <span>{dayNames[day]}</span>
                  <svg
                    class={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isExpanded && (
                  <Card.Content class="space-y-2 p-4">
                    {classes.map((classItem) => (
                      <button
                        key={classItem.id}
                        class={`w-full rounded-lg p-3 text-left leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                        onClick$={() => (selectedClass.value = classItem)}
                      >
                        <div class="mb-1 text-sm font-semibold">
                          {classItem.name}
                        </div>
                        <div class="flex items-center gap-1 text-xs opacity-90">
                          <LuClock class="h-3 w-3" />
                          {classItem.time}
                        </div>
                        <div class="mt-1 flex items-center gap-1 text-xs opacity-90">
                          <LuMapPin class="h-3 w-3" />
                          {classItem.room}
                        </div>
                        {classItem.ageGroup && (
                          <div class="mt-1 flex items-center gap-1 text-xs opacity-90">
                            <LuUsers class="h-3 w-3" />
                            {classItem.ageGroup}
                          </div>
                        )}
                        {classItem.level && (
                          <span class="mt-1 inline-block rounded bg-white/85 px-2 py-0.5 text-[10px] text-black">
                            {classItem.level}
                          </span>
                        )}
                      </button>
                    ))}
                  </Card.Content>
                )}
              </Card.Root>
            );
          })}
        </div>

        {selectedClass.value && (
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick$={onClose}
          >
            <Card.Root
              class="w-full max-w-md"
              onClick$={(e) => e.stopPropagation()}
            >
              <Card.Header>
                <Card.Title class="text-primary text-xl">
                  {selectedClass.value.name}
                </Card.Title>
              </Card.Header>
              <Card.Content class="space-y-4">
                <div class="flex items-center gap-2">
                  <LuClock class="text-muted-foreground h-5 w-5" />
                  <span>{selectedClass.value.time}</span>
                </div>
                <div class="flex items-center gap-2">
                  <LuMapPin class="text-muted-foreground h-5 w-5" />
                  <span>{selectedClass.value.room}</span>
                </div>
                {selectedClass.value.ageGroup && (
                  <div class="flex items-center gap-2">
                    <LuUsers class="text-muted-foreground h-5 w-5" />
                    <span>Grupo: {selectedClass.value.ageGroup}</span>
                  </div>
                )}
                {selectedClass.value.level && (
                  <span class="bg-primary text-primary-foreground inline-block w-fit rounded px-2 py-1">
                    Nivel: {selectedClass.value.level}
                  </span>
                )}
                <div class="pt-4">
                  <Button look="primary" class="w-full" onClick$={onClose}>
                    {_`dance.schedule.close`}
                  </Button>
                </div>
              </Card.Content>
            </Card.Root>
          </div>
        )}
      </div>
    </section>
  );
});

const Contact = component$(() => {
  return (
    <section class="bg-card py-20">
      <div class="container mx-auto px-4">
        <div class="mb-16 text-center">
          <h2 class="text-primary mb-6 text-4xl font-bold md:text-5xl">{_`dance.contact.title`}</h2>
          <p class="text-muted-foreground mx-auto max-w-2xl text-xl">{_`dance.contact.subtitle`}</p>
        </div>
        <div class="mx-auto max-w-4xl">
          <Card.Root class="hover:border-primary/50 border-2 transition-colors">
            <Card.Header class="text-center">
              <Card.Title class="text-primary mb-4 text-2xl">{_`dance.contact.director`}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div class="text-center">
                  <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                    <LuInstagram class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-foreground mb-2 font-semibold">Instagram</h3>
                  <Button
                    look="outline"
                    class="w-full"
                    onClick$={() =>
                      window.open(
                        "https://instagram.com/ritmos.en.accion",
                        "_blank",
                      )
                    }
                  >
                    @ritmos.en.acción
                  </Button>
                </div>
                <div class="text-center">
                  <div class="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <LuPhone class="text-primary-foreground h-8 w-8" />
                  </div>
                  <h3 class="text-foreground mb-2 font-semibold">Teléfono</h3>
                  <Button
                    look="outline"
                    class="w-full"
                    onClick$={() => window.open("tel:2235380187", "_blank")}
                  >
                    223 5380187
                  </Button>
                </div>
                <div class="text-center">
                  <div class="bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <LuMail class="text-secondary-foreground h-8 w-8" />
                  </div>
                  <h3 class="text-foreground mb-2 font-semibold">{_`dance.contact.email`}</h3>
                  <Button
                    look="outline"
                    class="w-full"
                    onClick$={() =>
                      window.open(
                        "mailto:socios@italianosenmiramar.com",
                        "_blank",
                      )
                    }
                  >
                    socios@italianosenmiramar.com
                  </Button>
                </div>
              </div>
              <div class="mt-12 text-center">
                <div class="bg-primary/10 rounded-lg p-8">
                  <h3 class="text-primary mb-4 text-2xl font-bold">{_`dance.contact.cta.title`}</h3>
                  <p class="text-muted-foreground mb-6">{_`dance.contact.cta.desc`}</p>
                  <Button
                    look="primary"
                    class="w-full px-4 py-4 text-sm sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                    onClick$={() =>
                      window.open("https://wa.me/2235380187", "_blank")
                    }
                  >
                    <LuPhone class="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span class="hidden sm:inline">{_`dance.contact.cta.whatsapp`}</span>
                    <span class="sm:hidden">WhatsApp</span>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </section>
  );
});

const Footer = component$(() => {
  return (
    <footer class="bg-primary text-primary-foreground py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <div class="mb-6 flex items-center justify-center gap-4">
            <LuMusic class="h-8 w-8" />
            <h3 class="text-2xl font-bold">RITMOS EN ACCIÓN</h3>
            <LuHeart class="h-8 w-8" />
          </div>
          <p class="text-primary-foreground/80 mx-auto mb-4 max-w-2xl">
            {_`dance.footer.desc`}
          </p>
          <div class="border-primary-foreground/20 mt-6 border-t pt-6">
            <p class="text-primary-foreground/60 mt-2 text-sm">
              © Ritmos en Acción
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default component$(() => {
  // #83277C converted to HSL ≈ 305 54% 33%
  const brandPrimary = "305 54% 33%";
  return (
    <div
      class="flex min-h-screen flex-col"
      style={{ "--primary": brandPrimary, "--primary-foreground": "0 0% 100%" }}
    >
      <main class="flex-1">
        <Hero />
        <Values />
        <Gallery />
        <Schedule />
        <Contact />
      </main>
      <Footer />
    </div>
  );
});

export const head: DocumentHead = {
  title: _`dance.metaTitle`,
  meta: [
    {
      name: "description",
      content: _`dance.metaDescription`,
    },
  ],
};

// La re-exportas como onStaticGenerate
export const onStaticGenerate = generateI18nPaths;
