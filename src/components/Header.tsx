import { component$, useSignal, getLocale } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import Logo from '~/media/logo.png?w=96&h=96&jsx';
import { NavLink } from "~/components/NavLink";
import { _, locales } from "compiled-i18n";
import { LuChevronDown, LuFacebook, LuInstagram, LuLanguages, LuMenu, LuPhone, LuX } from '@qwikest/icons/lucide';

export default component$(() => {
  const currentLocale = getLocale();
  const mobileMenuOpen = useSignal(false);
  const showLanguageDropdown = useSignal<boolean>(false);

  type NavigationItem = {
    name: any;
    href: string;
    dropdown?: boolean;
    items?: { name: any; href: string }[];
  };

  const navigation: NavigationItem[] = [
    { name: _`nav.home`, href: `/${currentLocale}` },
    { name: _`nav.services`, href: `/${currentLocale}/#servicios` },
    { name: _`nav.events`, href: `/${currentLocale}/eventos` },
    { name: _`nav.about`, href: `/${currentLocale}/nosotros` },
    { name: _`nav.join`, href: `/${currentLocale}/asociarse` },
    { name: _`nav.contact`, href: `/${currentLocale}/contacto` },
  ];

  const languageNamesShort: Record<string, string> = {
    'es': 'ES',
    'en': 'EN',
    'it': 'IT',
  };
  const languageNames: Record<string, string> = {
    'es': 'Español',
    'en': 'English',
    'it': 'Italiano',
  };

  return (
    <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* Top bar - Tricolor */}
      <div class="h-1.5 bg-gradient-to-r from-[#009246] via-white to-[#CE2B37]"></div>

      <div class="container mx-auto px-4">
        <div class="flex h-20 items-center justify-between">

          {/* Logo & Brand */}
          <Link href={`/${currentLocale}`} class="flex items-center gap-3 group">
            <div class="relative overflow-hidden rounded-full shadow-md transition-transform duration-300 group-hover:scale-105">
              <Logo
                alt="Círculo Italiano Miramar Logo"
                class="h-12 w-12 md:h-14 md:w-14"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold leading-tight text-gray-900 md:text-lg lg:text-xl">
                Mutual Cultural Círculo
              </span>
              <span class="text-sm font-medium uppercase tracking-wider md:text-xs">
                Italiano Joven Italia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav class="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                class="relative px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-green-700"
                activeClass="text-green-700 font-bold"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div class="flex items-center gap-3">

            {/* Socials (Desktop) */}
            <div class="hidden md:flex items-center gap-2 border-r border-gray-200 pr-4 mr-2">
              <a href="https://www.facebook.com/italianosenmiramar" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-[#1877F2] transition-colors p-2" aria-label="Facebook">
                <LuFacebook class="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/italianosenmiramar" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-[#E4405F] transition-colors p-2" aria-label="Instagram">
                <LuInstagram class="h-5 w-5" />
              </a>
            </div>

            {/* Language Selector */}
            <div class="relative">
              <button
                onClick$={() => showLanguageDropdown.value = !showLanguageDropdown.value}
                class="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700"
                aria-label={_`nav.changeLanguage`}
              >
                <LuLanguages class="h-4 w-4" />
                <span>{languageNamesShort[currentLocale]}</span>
                <LuChevronDown class={`h-3 w-3 transition-transform ${showLanguageDropdown.value ? 'rotate-180' : ''}`} />
              </button>

              {showLanguageDropdown.value && (
                <div class="absolute right-0 top-full mt-2 w-40 origin-top-right rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                  {locales.map((locale) => (
                    <a
                      key={locale}
                      href={`${currentLocale === locale ? "" : `/${locale}`}`}
                      class={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${locale === currentLocale
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {languageNames[locale]}
                      {locale === currentLocale && <span class="text-green-700">✓</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              class="lg:hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick$={() => mobileMenuOpen.value = true}
              aria-label="Menu"
            >
              <LuMenu class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen.value && (
        <div class="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            class="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick$={() => mobileMenuOpen.value = false}
          ></div>

          {/* Drawer */}
          <div class="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div class="flex h-full flex-col">

              {/* Drawer Header */}
              <div class="flex items-center justify-between border-b p-4">
                <span class="font-bold text-gray-900">Menú</span>
                <button
                  onClick$={() => mobileMenuOpen.value = false}
                  class="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <LuX class="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div class="flex-1 overflow-y-auto p-4">
                <nav class="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      href={item.href}
                      class="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
                      activeClass="bg-green-50 text-green-700 font-bold"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </nav>

                <div class="mt-8 border-t pt-6">
                  <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Contacto</h3>
                  <a href="tel:2291433766" class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <LuPhone class="h-5 w-5 text-green-700" />
                    <span>2291 433766</span>
                  </a>
                  <div class="mt-4 flex gap-4 px-4">
                    <a href="https://www.facebook.com/italianosenmiramar" class="rounded-full bg-blue-50 p-3 text-[#1877F2] transition-colors hover:bg-blue-100" aria-label="Facebook">
                      <LuFacebook class="h-6 w-6" />
                    </a>
                    <a href="https://www.instagram.com/italianosenmiramar" class="rounded-full bg-pink-50 p-3 text-[#E4405F] transition-colors hover:bg-pink-100" aria-label="Instagram">
                      <LuInstagram class="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
});
