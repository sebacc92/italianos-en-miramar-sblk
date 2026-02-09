import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { guessLocale } from "compiled-i18n";

export const onRequest: RequestHandler = async ({ request, redirect }) => {
  const acceptLang = request.headers.get("accept-language");
  const userLocale = guessLocale(acceptLang);
  throw redirect(302, `/${userLocale}/`);
};

export default component$(() => {
  return null;
});
