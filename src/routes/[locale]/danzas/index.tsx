import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuClock, LuMapPin, LuUsers, LuArrowDown, LuMusic, LuHeart, LuInstagram, LuPhone, LuMail, LuAward, LuSparkles, LuShield } from "@qwikest/icons/lucide";
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
        { id: "l1", name: "Juve 3 a 6 Urbano", time: "15:15 - 16:15", room: "Salón 1", type: "urban", ageGroup: "Juve 3 a 6" },
        { id: "l2", name: "Yoga", time: "15:30 - 16:30", room: "Salón 2", type: "yoga" },
        { id: "l3", name: "Juve 1 y 2 Urbano", time: "16:30 - 17:30", room: "Salón 1", type: "urban", ageGroup: "Juve 1 y 2" },
        { id: "l4", name: "Espacio para ensayar", time: "16:30 - 17:30", room: "Salón 2", type: "ensayo" },
        { id: "l5", name: "Espacio para ensayar", time: "18:30 - 19:30", room: "Salón 1", type: "ensayo" },
        { id: "l6", name: "Espacio para ensayar", time: "18:30 - 19:30", room: "Salón 2", type: "ensayo" },
        { id: "l7", name: "Inf 3 y 4 Ritmos", time: "18:30 - 19:30", room: "Aula 2", type: "ritmos", ageGroup: "Inf 3 y 4" },
        { id: "l8", name: "Inf 5 y 6 Ritmos", time: "19:30 - 20:30", room: "Salón 1", type: "ritmos", ageGroup: "Inf 5 y 6" },
        { id: "l9", name: "Kangoo Jump", time: "19:30 - 20:30", room: "Salón 2", type: "kangoo" },
        { id: "l10", name: "Inf 5 y 6 Italiano", time: "19:00 - 19:30", room: "Aula 2", type: "italiano", ageGroup: "Inf 5 y 6" },
        { id: "l11", name: "+18 Ritmos", time: "20:30 - 21:30", room: "Salón 1", type: "ritmos", ageGroup: "+18" },
        { id: "l12", name: "Espacio para ensayar", time: "20:30 - 21:30", room: "Salón 2", type: "ensayo" },
        { id: "l13", name: "Inf 3 y 4 Italiano", time: "19:30 - 20:00", room: "Aula 2", type: "italiano", ageGroup: "Inf 3 y 4" },
    ],
    martes: [
        { id: "m1", name: "Acond. Integral", time: "09:00 - 10:00", room: "Salón 1", type: "integral" },
        { id: "m2", name: "+18 Ritmos", time: "15:00 - 16:00", room: "Salón 1", type: "ritmos", ageGroup: "+18" },
        { id: "m3", name: "Acond. Integral", time: "15:00 - 16:00", room: "Salón 2", type: "integral" },
        { id: "m4", name: "Juve 1 y 2 Ex.Mov.", time: "16:30 - 17:30", room: "Salón 1", type: "exmov", ageGroup: "Juve 1 y 2" },
        { id: "m5", name: "Espacio para ensayar", time: "16:30 - 17:30", room: "Salón 2", type: "ensayo" },
        { id: "m6", name: "Mini 3, 4 y 5", time: "17:30 - 18:15", room: "Salón 1", type: "ritmos", ageGroup: "Mini 3, 4 y 5" },
        { id: "m7", name: "Mini 1 y 2 Ex.Mov.", time: "17:00 - 17:30", room: "Salón 2", type: "exmov", ageGroup: "Mini 1 y 2" },
        { id: "m8", name: "Juve 3 a 6 Jazz", time: "18:15 - 19:15", room: "Salón 1", type: "jazz", ageGroup: "Juve 3 a 6" },
        { id: "m9", name: "Inf 3 a 6 DTM", time: "18:15 - 20:15", room: "Salón 2", type: "dtm", ageGroup: "Inf 3 a 6" },
        { id: "m10", name: "Inf 1 y 2 Ritmos", time: "19:15 - 20:15", room: "Salón 1", type: "ritmos", ageGroup: "Inf 1 y 2" },
        { id: "m11", name: "+18 Ex. del Mov.", time: "20:30 - 21:30", room: "Salón 1", type: "exmov", ageGroup: "+18" },
        { id: "m12", name: "Espacio para ensayar", time: "20:30 - 21:30", room: "Salón 2", type: "ensayo" },
    ],
    miercoles: [
        { id: "mi1", name: "Kangoo Jump", time: "09:00 - 10:00", room: "Salón 2", type: "kangoo" },
        { id: "mi2", name: "Pilates Fusión", time: "10:00 - 11:00", room: "Salón 1", type: "pilates" },
        { id: "mi3", name: "Yoga", time: "10:00 - 11:00", room: "Aula 2", type: "yoga" },
        { id: "mi4", name: "Juveniles Grupo Coreograf.", time: "15:30 - 17:00", room: "Salón 1", type: "urban", ageGroup: "Juveniles" },
        { id: "mi5", name: "Espacio para ensayar", time: "15:00 - 16:00", room: "Salón 2", type: "ensayo" },
        { id: "mi6", name: "+18 avanzado Jazz", time: "16:00 - 17:00", room: "Salón 2", type: "jazz", ageGroup: "+18", level: "avanzado" },
        { id: "mi7", name: "Juve 3 a 6 Ex.Mov.", time: "17:00 - 18:00", room: "Salón 1", type: "exmov", ageGroup: "Juve 3 a 6" },
        { id: "mi8", name: "Juve 1 y 2 Jazz", time: "17:15 - 18:15", room: "Salón 2", type: "jazz", ageGroup: "Juve 1 y 2" },
        { id: "mi9", name: "Inf 3 y 4 Urbano", time: "18:30 - 19:30", room: "Salón 1", type: "urban", ageGroup: "Inf 3 y 4" },
        { id: "mi10", name: "Juveniles DTM", time: "18:30 - 20:30", room: "Salón 2", type: "dtm", ageGroup: "Juveniles" },
        { id: "mi11", name: "Inf 5 y 6 Urbano", time: "19:30 - 20:30", room: "Salón 1", type: "urban", ageGroup: "Inf 5 y 6" },
        { id: "mi12", name: "+18 Jazz", time: "20:30 - 21:30", room: "Salón 1", type: "jazz", ageGroup: "+18" },
        { id: "mi13", name: "+18 Urbano", time: "20:30 - 21:30", room: "Salón 2", type: "urban", ageGroup: "+18" },
    ],
    jueves: [
        { id: "j1", name: "Acond. Integral", time: "09:00 - 10:00", room: "Salón 1", type: "integral" },
        { id: "j2", name: "Juve 3 a 6 Ritmos", time: "15:15 - 16:15", room: "Salón 1", type: "ritmos", ageGroup: "Juve 3 a 6" },
        { id: "j3", name: "Acond. Integral", time: "15:00 - 16:00", room: "Salón 2", type: "integral" },
        { id: "j4", name: "Juve 1 y 2 Ritmos", time: "16:30 - 17:30", room: "Salón 1", type: "ritmos", ageGroup: "Juve 1 y 2" },
        { id: "j5", name: "+18 avanzado Fusión", time: "16:00 - 17:00", room: "Salón 2", type: "fusion", ageGroup: "+18", level: "avanzado" },
        { id: "j6", name: "Mini 3, 4 y 5", time: "17:30 - 18:15", room: "Salón 1", type: "ritmos", ageGroup: "Mini 3, 4 y 5" },
        { id: "j7", name: "Espacio para ensayar", time: "17:30 - 18:15", room: "Salón 2", type: "ensayo" },
        { id: "j8", name: "Juve 3 a 6 Jazz", time: "18:15 - 19:15", room: "Salón 1", type: "jazz", ageGroup: "Juve 3 a 6" },
        { id: "j9", name: "Inf 1 y 2 DTM", time: "18:15 - 19:15", room: "Salón 2", type: "dtm", ageGroup: "Inf 1 y 2" },
        { id: "j10", name: "Juve 1 a 6 Fusión", time: "19:15 - 20:15", room: "Salón 1", type: "fusion", ageGroup: "Juve 1 a 6" },
        { id: "j11", name: "Inf 1 y 2 DTM + Ritmos", time: "19:15 - 20:15", room: "Salón 2", type: "dtm", ageGroup: "Inf 1 y 2" },
        { id: "j12", name: "+18 Ritmos", time: "20:30 - 21:30", room: "Salón 1", type: "ritmos", ageGroup: "+18" },
        { id: "j13", name: "Yoga", time: "20:30 - 21:30", room: "Salón 2", type: "yoga" },
    ],
    viernes: [
        { id: "v1", name: "Kangoo Jump", time: "09:00 - 10:00", room: "Salón 1", type: "kangoo" },
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
        <section class="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50">
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
            <div class="container mx-auto px-4 text-center relative z-10">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8">
                        <img
                            src="/images/ritmos-en-accion/logo.png"
                            alt="Ritmos en Acción"
                            class="mx-auto mb-4 w-48 h-48 object-contain"
                            width={256}
                            height={256}
                            loading="lazy"
                        />
                        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-4 animate-heartbeat leading-[0.95] tracking-tight">
                            <span class="block">RITMOS</span>
                            <span class="block">EN ACCIÓN</span>
                        </h1>
                        <div class="flex items-center justify-center gap-4 text-2xl md:text-3xl text-muted-foreground mb-6 animate-heartbeat">
                            <LuMusic class="w-8 h-8" />
                            <span class="font-medium">{_`dance.hero.schoolType`}</span>
                            <LuHeart class="w-8 h-8" />
                        </div>
                    </div>
                    <blockquote class="text-xl md:text-2xl text-foreground/80 italic mb-2">
                        "{_`dance.hero.quote`}"
                    </blockquote>
                    <cite class="text-muted-foreground">- {_`dance.hero.author`}</cite>
                    <div class="mt-12 mb-12">
                        <p class="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                            {_`dance.hero.description`}
                        </p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button look="primary" class="text-lg px-8 py-6" onClick$={scrollToSchedule}>
                            <LuUsers class="w-5 h-5 mr-2" />
                            {_`dance.hero.scheduleBtn`}
                        </Button>
                        <Button look="outline" class="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick$={() => window.open("https://wa.me/2235380187", "_blank")}>
                            {_`dance.hero.contactBtn`}
                        </Button>
                    </div>
                    <div class="mt-16 animate-bounce">
                        <LuArrowDown class="w-8 h-8 mx-auto text-muted-foreground" />
                    </div>
                </div>
            </div>
        </section>
    );
});

const Values = component$(() => {
    const values = [
        { icon: LuAward, title: _`dance.values.professionalism.title`, description: _`dance.values.professionalism.desc` },
        { icon: LuSparkles, title: _`dance.values.authenticity.title`, description: _`dance.values.authenticity.desc` },
        { icon: LuHeart, title: _`dance.values.respect.title`, description: _`dance.values.respect.desc` },
        { icon: LuShield, title: _`dance.values.containment.title`, description: _`dance.values.containment.desc` },
        { icon: LuUsers, title: _`dance.values.belonging.title`, description: _`dance.values.belonging.desc` },
    ];
    return (
        <section class="py-20 bg-card">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">{_`dance.values.title`}</h2>
                    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">{_`dance.values.subtitle`}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {values.map((v) => (
                        <Card.Root key={v.title} class="border-2 hover:border-primary/50 bg-background transition-all">
                            <Card.Content class="p-8 text-center">
                                <div class="mb-6">
                                    <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <v.icon class="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 class="text-xl font-bold text-primary mb-4">{v.title}</h3>
                                </div>
                                <p class="text-muted-foreground leading-relaxed">{v.description}</p>
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
        <section class="py-20 bg-background">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">{_`dance.gallery.title`}</h2>
                    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">{_`dance.gallery.subtitle`}</p>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {images.slice(0, visibleCount.value).map((num) => (
                        <div key={num} class="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick$={() => openModal(num)}>
                            <img
                                src={`/images/ritmos-en-accion/${num}.jpeg`}
                                alt={`Ritmos en Acción - Imagen ${num}`}
                                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {visibleCount.value < 55 && (
                    <div class="text-center mt-12">
                        <Button look="outline" class="px-8 py-3" onClick$={showMore}>
                            {_`dance.gallery.viewMore`} ({55 - visibleCount.value} {_`dance.gallery.remaining`})
                        </Button>
                    </div>
                )}

                {/* Modal */}
                {selectedImage.value && (
                    <div
                        class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        onClick$={closeModal}
                    >
                        <div class="relative max-w-4xl max-h-[90vh] w-full" onClick$={(e) => e.stopPropagation()}>
                            <button
                                class="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                                onClick$={closeModal}
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            <img
                                src={`/images/ritmos-en-accion/${selectedImage.value}.jpeg`}
                                alt={`Ritmos en Acción - Imagen ${selectedImage.value}`}
                                class="w-full h-full object-contain rounded-lg"
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
        <section id="schedule" class="py-20 bg-green-50">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">{_`dance.schedule.title`}</h2>
                        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">{_`dance.schedule.subtitle`}</p>
                    </div>
                </div>
                {/* Desktop Grid View - 5 columns */}
                <div class="hidden xl:grid grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {dayOrder.map((day) => {
                        const classes = scheduleData[day] || [];
                        return (
                            <Card.Root key={day} class="bg-green-100/70 rounded-xl p-3">
                                <Card.Header class="pb-3">
                                    <Card.Title class="text-center text-base font-bold text-white bg-primary py-2 rounded-lg">
                                        {dayNames[day]}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Content class="space-y-2">
                                    {classes.map((classItem) => (
                                        <button
                                            key={classItem.id}
                                            class={`w-full text-left p-3 rounded-lg leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                                            onClick$={() => (selectedClass.value = classItem)}
                                        >
                                            <div class="text-sm font-semibold mb-1">{classItem.name}</div>
                                            <div class="text-xs opacity-90 flex items-center gap-1">
                                                <LuClock class="w-3 h-3" />
                                                {classItem.time}
                                            </div>
                                            <div class="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                <LuMapPin class="w-3 h-3" />
                                                {classItem.room}
                                            </div>
                                            {classItem.ageGroup && (
                                                <div class="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                    <LuUsers class="w-3 h-3" />
                                                    {classItem.ageGroup}
                                                </div>
                                            )}
                                            {classItem.level && (
                                                <span class="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-white/85 text-black">
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
                <div class="hidden md:grid xl:hidden grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {dayOrder.map((day) => {
                        const classes = scheduleData[day] || [];
                        return (
                            <Card.Root key={day} class="bg-green-100/70 rounded-xl p-3">
                                <Card.Header class="pb-3">
                                    <Card.Title class="text-center text-sm font-bold text-white bg-primary py-2 rounded-lg">
                                        {dayNames[day]}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Content class="space-y-2">
                                    {classes.map((classItem) => (
                                        <button
                                            key={classItem.id}
                                            class={`w-full text-left p-2 rounded-lg leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                                            onClick$={() => (selectedClass.value = classItem)}
                                        >
                                            <div class="text-xs font-semibold mb-1">{classItem.name}</div>
                                            <div class="text-[10px] opacity-90 flex items-center gap-1">
                                                <LuClock class="w-2 h-2" />
                                                {classItem.time}
                                            </div>
                                            <div class="text-[10px] opacity-90 flex items-center gap-1 mt-1">
                                                <LuMapPin class="w-2 h-2" />
                                                {classItem.room}
                                            </div>
                                            {classItem.ageGroup && (
                                                <div class="text-[10px] opacity-90 flex items-center gap-1 mt-1">
                                                    <LuUsers class="w-2 h-2" />
                                                    {classItem.ageGroup}
                                                </div>
                                            )}
                                            {classItem.level && (
                                                <span class="inline-block mt-1 text-[8px] px-1 py-0.5 rounded bg-white/85 text-black">
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
                <div class="md:hidden space-y-4 max-w-2xl mx-auto">
                    {dayOrder.map((day) => {
                        const classes = scheduleData[day] || [];
                        const isExpanded = expandedDays.value.has(day);
                        return (
                            <Card.Root key={day} class="bg-green-100/70 rounded-xl overflow-hidden">
                                <button
                                    class="w-full p-4 text-left bg-primary text-white font-bold flex items-center justify-between"
                                    onClick$={() => toggleDay(day)}
                                >
                                    <span>{dayNames[day]}</span>
                                    <svg
                                        class={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isExpanded && (
                                    <Card.Content class="p-4 space-y-2">
                                        {classes.map((classItem) => (
                                            <button
                                                key={classItem.id}
                                                class={`w-full text-left p-3 rounded-lg leading-tight shadow-sm ${typeClasses[classItem.type]}`}
                                                onClick$={() => (selectedClass.value = classItem)}
                                            >
                                                <div class="text-sm font-semibold mb-1">{classItem.name}</div>
                                                <div class="text-xs opacity-90 flex items-center gap-1">
                                                    <LuClock class="w-3 h-3" />
                                                    {classItem.time}
                                                </div>
                                                <div class="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                    <LuMapPin class="w-3 h-3" />
                                                    {classItem.room}
                                                </div>
                                                {classItem.ageGroup && (
                                                    <div class="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                        <LuUsers class="w-3 h-3" />
                                                        {classItem.ageGroup}
                                                    </div>
                                                )}
                                                {classItem.level && (
                                                    <span class="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-white/85 text-black">
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
                        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick$={onClose}
                    >
                        <Card.Root class="max-w-md w-full" onClick$={(e) => e.stopPropagation()}>
                            <Card.Header>
                                <Card.Title class="text-xl text-primary">{selectedClass.value.name}</Card.Title>
                            </Card.Header>
                            <Card.Content class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <LuClock class="w-5 h-5 text-muted-foreground" />
                                    <span>{selectedClass.value.time}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <LuMapPin class="w-5 h-5 text-muted-foreground" />
                                    <span>{selectedClass.value.room}</span>
                                </div>
                                {selectedClass.value.ageGroup && (
                                    <div class="flex items-center gap-2">
                                        <LuUsers class="w-5 h-5 text-muted-foreground" />
                                        <span>Grupo: {selectedClass.value.ageGroup}</span>
                                    </div>
                                )}
                                {selectedClass.value.level && (
                                    <span class="inline-block w-fit px-2 py-1 rounded bg-primary text-primary-foreground">
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
        <section class="py-20 bg-card">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">{_`dance.contact.title`}</h2>
                    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">{_`dance.contact.subtitle`}</p>
                </div>
                <div class="max-w-4xl mx-auto">
                    <Card.Root class="border-2 hover:border-primary/50 transition-colors">
                        <Card.Header class="text-center">
                            <Card.Title class="text-2xl text-primary mb-4">{_`dance.contact.director`}</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <LuInstagram class="w-8 h-8 text-white" />
                                    </div>
                                    <h3 class="font-semibold text-foreground mb-2">Instagram</h3>
                                    <Button look="outline" class="w-full" onClick$={() => window.open("https://instagram.com/ritmos.en.accion", "_blank")}>@ritmos.en.acción</Button>
                                </div>
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <LuPhone class="w-8 h-8 text-primary-foreground" />
                                    </div>
                                    <h3 class="font-semibold text-foreground mb-2">Teléfono</h3>
                                    <Button look="outline" class="w-full" onClick$={() => window.open("tel:2235380187", "_blank")}>223 5380187</Button>
                                </div>
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                        <LuMail class="w-8 h-8 text-secondary-foreground" />
                                    </div>
                                    <h3 class="font-semibold text-foreground mb-2">{_`dance.contact.email`}</h3>
                                    <Button look="outline" class="w-full" onClick$={() => window.open("mailto:socios@italianosenmiramar.com", "_blank")}>
                                        socios@italianosenmiramar.com
                                    </Button>
                                </div>
                            </div>
                            <div class="mt-12 text-center">
                                <div class="bg-primary/10 rounded-lg p-8">
                                    <h3 class="text-2xl font-bold text-primary mb-4">{_`dance.contact.cta.title`}</h3>
                                    <p class="text-muted-foreground mb-6">{_`dance.contact.cta.desc`}</p>
                                    <Button look="primary" class="text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-auto" onClick$={() => window.open("https://wa.me/2235380187", "_blank")}>
                                        <LuPhone class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
                    <div class="flex items-center justify-center gap-4 mb-6">
                        <LuMusic class="w-8 h-8" />
                        <h3 class="text-2xl font-bold">RITMOS EN ACCIÓN</h3>
                        <LuHeart class="w-8 h-8" />
                    </div>
                    <p class="text-primary-foreground/80 mb-4 max-w-2xl mx-auto">
                        {_`dance.footer.desc`}
                    </p>
                    <div class="border-t border-primary-foreground/20 pt-6 mt-6">
                        <p class="text-primary-foreground/60 text-sm mt-2">© Ritmos en Acción</p>
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
        <div class="flex min-h-screen flex-col" style={{ "--primary": brandPrimary, "--primary-foreground": "0 0% 100%" }}>
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