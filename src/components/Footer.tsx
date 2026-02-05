import { component$, getLocale } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { _ } from "compiled-i18n";
import { LuMapPin, LuPhone, LuMail, LuFacebook, LuInstagram } from "@qwikest/icons/lucide";
import Logo from '~/media/logo.png?w=96&h=96&jsx';

export default component$(() => {
    const currentLocale = getLocale();
    const currentYear = new Date().getFullYear();

    return (
        <footer class="bg-gray-900 text-white pt-16 pb-8">
            <div class="container mx-auto px-4">
                <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">

                    {/* Brand Column */}
                    <div class="space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                                <Logo
                                    alt="Círculo Italiano Miramar Logo"
                                    class="h-14 w-14"
                                />
                            </div>
                            <div>
                                <h3 class="font-bold text-lg leading-tight">Círculo Italiano</h3>
                                <p class="text-xs text-gray-400 uppercase tracking-widest">Miramar • Joven Italia</p>
                            </div>
                        </div>
                        <p class="text-gray-400 text-sm leading-relaxed">
                            {_`footer.description`}
                        </p>
                        <div class="flex gap-4">
                            <a
                                href="https://www.facebook.com/italianosenmiramar"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="bg-white/5 hover:bg-[#1877F2] p-2 rounded-full transition-all duration-300 hover:-translate-y-1"
                                aria-label="Facebook"
                            >
                                <LuFacebook class="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/italianosenmiramar"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="bg-white/5 hover:bg-[#E4405F] p-2 rounded-full transition-alel duration-300 hover:-translate-y-1"
                                aria-label="Instagram"
                            >
                                <LuInstagram class="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 class="text-lg font-bold mb-6 relative inline-block">
                            {_`footer.quickLinks`}
                            <span class="absolute -bottom-2 left-0 w-12 h-1 bg-green-600 rounded-full"></span>
                        </h4>
                        <ul class="space-y-3 text-sm">
                            <li>
                                <Link href={`/${currentLocale}/nosotros`} class="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <span class="w-1 h-1 bg-white rounded-full"></span>
                                    {_`nav.about`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}#servicios`} class="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <span class="w-1 h-1 bg-red-500 rounded-full"></span>
                                    {_`nav.services`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}/eventos`} class="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <span class="w-1 h-1 bg-green-500 rounded-full"></span>
                                    {_`nav.events`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}/asociate`} class="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <span class="w-1 h-1 bg-white rounded-full"></span>
                                    {_`nav.join`}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 class="text-lg font-bold mb-6 relative inline-block">
                            {_`nav.services`}
                            <span class="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full"></span>
                        </h4>
                        <ul class="space-y-3 text-sm">
                            <li>
                                <Link href={`/${currentLocale}/clases`} class="text-gray-400 hover:text-white transition-colors">
                                    {_`footer.service.italian`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}/ciudadania`} class="text-gray-400 hover:text-white transition-colors">
                                    {_`footer.service.citizenship`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}/salones`} class="text-gray-400 hover:text-white transition-colors">
                                    {_`footer.service.rentals`}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${currentLocale}/cultura`} class="text-gray-400 hover:text-white transition-colors">
                                    {_`footer.service.cultural`}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 class="text-lg font-bold mb-6 relative inline-block">
                            {_`nav.contact`}
                            <span class="absolute -bottom-2 left-0 w-12 h-1 bg-red-600 rounded-full"></span>
                        </h4>
                        <ul class="space-y-4 text-sm">
                            <li class="flex items-start gap-3 text-gray-400">
                                <LuMapPin class="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>Calle 24 nº 1214<br />Miramar, Buenos Aires (7607)</span>
                            </li>
                            <li class="flex items-center gap-3 text-gray-400">
                                <LuPhone class="h-5 w-5 text-white shrink-0" />
                                <a href="tel:2291433766" class="hover:text-white transition-colors">2291 433766</a>
                            </li>
                            <li class="flex items-center gap-3 text-gray-400">
                                <LuMail class="h-5 w-5 text-red-500 shrink-0" />
                                <a href="mailto:socios@italianosenmiramar.com" class="hover:text-white transition-colors">socios@italianosenmiramar.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div class="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>
                        © {currentYear} Mutual Cultural Círculo Italiano Joven Italia. {_`footer.copyright`}
                    </p>
                    <a
                        href="https://cleverisma.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:text-white transition-colors flex items-center gap-2"
                    >
                        Desarrollado por <span class="font-semibold">Cleverisma</span>
                    </a>
                </div>

                {/* Tricolor Line Bottom */}
                <div class="w-full h-1 bg-gradient-to-r from-[#009246] via-white to-[#CE2B37] mt-8 opacity-50"></div>
            </div>
        </footer>
    );
});
