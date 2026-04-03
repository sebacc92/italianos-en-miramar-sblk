import { component$, getLocale } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Card } from "~/components/ui/card/card";
import { Button } from "~/components/ui/Button";
import { stripHtml } from "~/utils/stringUtils";
import { _ } from "compiled-i18n";

export interface EventProps {
  id: string | number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  eventDate?: string | null;
}

interface EventCardProps {
  evento: EventProps;
  baseHref?: string; // e.g. `/${currentLocale}/eventos`
}

export const EventCard = component$<EventCardProps>(({ evento, baseHref }) => {
  const currentLocale = getLocale() || "es";
  const defaultBasePath = `/${currentLocale}/eventos`;
  const href = `${baseHref || defaultBasePath}/${evento.id}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha por confirmar";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha por confirmar";
    try {
      return new Intl.DateTimeFormat(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const cleanDescription = evento.description ? stripHtml(evento.description) : "";

  return (
    <Card.Root class="overflow-hidden transition-shadow hover:shadow-xl flex flex-col bg-white">
      {evento.imageUrl && (
        <div class="aspect-square w-full overflow-hidden bg-zinc-100 flex items-center justify-center">
          <img
            src={evento.imageUrl}
            alt={evento.imageAlt || evento.title}
            class="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
            width="600"
            height="400"
            loading="lazy"
          />
        </div>
      )}
      <Card.Header>
        <div class="mb-2 flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mr-2 h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          {evento.eventDate ? formatDate(evento.eventDate) : "Fecha por confirmar"}
        </div>
      </Card.Header>
      <Card.Content class="flex flex-col flex-1">
        <Card.Title class="mb-2 line-clamp-2 text-xl">
          {evento.title}
        </Card.Title>
        {cleanDescription && (
          <p class="mb-4 line-clamp-3 text-sm text-gray-600 flex-1" title={cleanDescription}>
            {cleanDescription}
          </p>
        )}
        <div class="mt-auto pt-4">
          <Link href={href}>
            <Button variant="outline" fullWidth class="group">
              {_`events.viewMore` || "Ver más"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </Card.Content>
    </Card.Root>
  );
});
