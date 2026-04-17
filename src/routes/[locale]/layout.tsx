import { component$, Slot } from "@builder.io/qwik";
import { RequestHandler, routeLoader$ } from "@builder.io/qwik-city";
import { guessLocale, locales } from "compiled-i18n";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { WhatsAppButton } from "~/components/WhatsAppButton";
import { ScrollToTop } from "~/components/scroll-to-top";
import { Chatbot } from "~/components/chatbot/chatbot";
import { getDb } from "~/db/client.server";
import { siteSettings } from "~/db/schema.server";
import { eq } from "drizzle-orm";

export const onStaticGenerate = async () => {
  return locales.map((locale) => ({
    locale,
  }));
};

export const useSiteSettings = routeLoader$(async ({ env }) => {
  const db = getDb(env);
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, '1')).limit(1);
  return settings || { aiEnabled: false };
});

const replaceLocale = (pathname: string, oldLocale: string, locale: string) => {
  const idx = pathname.indexOf(oldLocale);
  return (
    pathname.slice(0, idx) + locale + pathname.slice(idx + oldLocale.length)
  );
};

export const onRequest: RequestHandler = async ({
  request,
  url,
  redirect,
  pathname,
  params,
  locale,
}) => {
  if (locales.includes(params.locale)) {
    // Set the locale for this request
    locale(params.locale);
  } else {
    const acceptLang = request.headers.get("accept-language");
    // Redirect to the correct locale
    const guessedLocale = guessLocale(acceptLang);
    const path =
      // You can use `__` as the locale in URLs to auto-select it
      params.locale === "__" ||
      /^([a-z]{2})([_-]([a-z]{2}))?$/i.test(params.locale)
        ? // invalid locale
          "/" + replaceLocale(pathname, params.locale, guessedLocale)
        : // no locale
          `/${guessedLocale}${pathname}`;
    throw redirect(301, `${path}${url.search}`);
  }
};

export default component$(() => {
  const settings = useSiteSettings();
  
  return (
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <Slot />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      {!!settings.value?.aiEnabled ? <Chatbot /> : null}
    </div>
  );
});
