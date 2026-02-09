import { component$, getLocale } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuFacebook,
  LuInstagram,
} from "@qwikest/icons/lucide";
import Logo from "~/media/logo.png?w=96&h=96&jsx";

export default component$(() => {
  const currentLocale = getLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-gray-900 pt-16 pb-8 text-white">
      <div class="container mx-auto px-4">
        <div class="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                <Logo alt="Círculo Italiano Miramar Logo" class="h-14 w-14" />
              </div>
              <div>
                <h3 class="text-lg leading-tight font-bold">
                  Círculo Italiano
                </h3>
                <p class="text-xs tracking-widest text-gray-400 uppercase">
                  Miramar • Joven Italia
                </p>
              </div>
            </div>
            <p class="text-sm leading-relaxed text-gray-400">
              {_`footer.description`}
            </p>
            <div class="flex gap-4">
              <a
                href="https://www.facebook.com/italianosenmiramar"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-full bg-white/5 p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1877F2]"
                aria-label="Facebook"
              >
                <LuFacebook class="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/italianosenmiramar"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-alel rounded-full bg-white/5 p-2 duration-300 hover:-translate-y-1 hover:bg-[#E4405F]"
                aria-label="Instagram"
              >
                <LuInstagram class="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 class="relative mb-6 inline-block text-lg font-bold">
              {_`footer.quickLinks`}
              <span class="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-green-600"></span>
            </h4>
            <ul class="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${currentLocale}/nosotros`}
                  class="flex items-center gap-2 text-gray-400 transition-all duration-200 hover:pl-2 hover:text-white"
                >
                  <span class="h-1 w-1 rounded-full bg-white"></span>
                  {_`nav.about`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}#servicios`}
                  class="flex items-center gap-2 text-gray-400 transition-all duration-200 hover:pl-2 hover:text-white"
                >
                  <span class="h-1 w-1 rounded-full bg-red-500"></span>
                  {_`nav.services`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/eventos`}
                  class="flex items-center gap-2 text-gray-400 transition-all duration-200 hover:pl-2 hover:text-white"
                >
                  <span class="h-1 w-1 rounded-full bg-green-500"></span>
                  {_`nav.events`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/asociarse`}
                  class="flex items-center gap-2 text-gray-400 transition-all duration-200 hover:pl-2 hover:text-white"
                >
                  <span class="h-1 w-1 rounded-full bg-white"></span>
                  {_`nav.join`}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 class="relative mb-6 inline-block text-lg font-bold">
              {_`nav.services`}
              <span class="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-white"></span>
            </h4>
            <ul class="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${currentLocale}/clases`}
                  class="text-gray-400 transition-colors hover:text-white"
                >
                  {_`footer.service.italian`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/ciudadania`}
                  class="text-gray-400 transition-colors hover:text-white"
                >
                  {_`footer.service.citizenship`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/salones`}
                  class="text-gray-400 transition-colors hover:text-white"
                >
                  {_`footer.service.rentals`}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/cultura`}
                  class="text-gray-400 transition-colors hover:text-white"
                >
                  {_`footer.service.cultural`}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 class="relative mb-6 inline-block text-lg font-bold">
              {_`nav.contact`}
              <span class="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-red-600"></span>
            </h4>
            <ul class="space-y-4 text-sm">
              <li class="flex items-start gap-3 text-gray-400">
                <LuMapPin class="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <span>
                  Calle 24 nº 1214
                  <br />
                  Miramar, Buenos Aires (7607)
                </span>
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <LuPhone class="h-5 w-5 shrink-0 text-white" />
                <a
                  href="tel:2291433766"
                  class="transition-colors hover:text-white"
                >
                  2291 433766
                </a>
              </li>
              <li class="flex items-center gap-3 text-gray-400">
                <LuMail class="h-5 w-5 shrink-0 text-red-500" />
                <a
                  href="mailto:socios@italianosenmiramar.com"
                  class="transition-colors hover:text-white"
                >
                  socios@italianosenmiramar.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-400 md:flex-row">
          <p>
            © {currentYear} Mutual Cultural Círculo Italiano Joven Italia.{" "}
            {_`footer.copyright`}
          </p>
          <a
            href="https://cleverisma.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 transition-colors hover:text-white"
          >
            Desarrollado por <span class="font-semibold">Cleverisma</span>
          </a>
        </div>

        {/* Tricolor Line Bottom */}
        <div class="mt-8 h-1 w-full bg-gradient-to-r from-[#009246] via-white to-[#CE2B37] opacity-50"></div>
      </div>
    </footer>
  );
});
