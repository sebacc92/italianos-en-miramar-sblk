import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation, routeLoader$ } from "@builder.io/qwik-city";
import {
  LuLayoutDashboard,
  LuUsers,
  LuLandmark,
  LuCalendar,
  LuLanguages,
  LuImage,
  LuMusic,
  LuApple,
  LuPalette,
  LuLogOut
} from "@qwikest/icons/lucide";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LuLayoutDashboard class="h-5 w-5" />,
  },
  {
    href: "/admin/autoridades",
    label: "Autoridades",
    icon: <LuUsers class="h-5 w-5" />,
  },
  {
    href: "/admin/ciudadania",
    label: "Ciudadanía",
    icon: <LuLandmark class="h-5 w-5" />,
  },
  {
    href: "/admin/exposiciones",
    label: "Exposiciones",
    icon: <LuPalette class="h-5 w-5" />,
  },
  {
    href: "/admin/eventos",
    label: "Eventos",
    icon: <LuCalendar class="h-5 w-5" />,
  },
  {
    href: "/admin/cursos",
    label: "Cursos de Idiomas",
    icon: <LuLanguages class="h-5 w-5" />,
  },

  {
    href: "/admin/danzas",
    label: "Ritmos en acción",
    icon: <LuMusic class="h-5 w-5" />,
  },
  {
    href: "/admin/nutricion",
    label: "Nutrición",
    icon: <LuApple class="h-5 w-5" />,
  },
  {
    href: "/admin/arte",
    label: "Taller de arte",
    icon: <LuPalette class="h-5 w-5" />,
  },
];

const AccessDenied = component$(() => {
  return (
    <div class="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div class="mb-4 rounded-full bg-red-100 p-4">
        <LuLogOut class="h-10 w-10 text-red-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
      <p class="mt-2 text-gray-500 max-w-md">
        No tienes permisos para editar esta sección. Contacta al administrador de Cleverisma.
      </p>
    </div>
  );
});

export const useAdminSession = routeLoader$((requestEvent) => {
  return {
    user: requestEvent.sharedMap.get('user'),
    accessDenied: requestEvent.sharedMap.get('access_denied') === true
  };
});

export default component$(() => {
  const location = useLocation();
  const adminSession = useAdminSession();

  const isLoginPage = location.url.pathname.startsWith("/admin/login");

  if (isLoginPage) {
    return <Slot />;
  }
  
  const user = adminSession.value.user;
  const userEmail = typeof user?.username === 'string' ? user.username : 'Admin';
  const accessDenied = adminSession.value.accessDenied;

  return (
    <div class="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside class="fixed left-0 top-0 z-40 flex min-h-screen w-64 flex-col bg-gray-900 text-white shadow-2xl">
        {/* Brand */}
        <div class="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600">
            <span class="text-xs font-black text-white">CI</span>
          </div>
          <div>
            <p class="h-4 text-xs font-bold uppercase leading-none tracking-widest text-green-500">
              Admin
            </p>
            <p class="text-sm font-semibold leading-tight text-white">
              Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav class="flex-1 space-y-1 px-3 py-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? location.url.pathname === "/admin" ||
                location.url.pathname === "/admin/"
                : location.url.pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                class={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div class="border-t border-white/10 px-6 py-4">
          <Link
            href="/admin/logout"
            class="flex w-full items-center gap-2 text-xs text-gray-400 transition-colors hover:text-red-400"
          >
            <LuLogOut class="h-4 w-4" />
            Cerrar sesión
          </Link>
          <p class="mt-2 text-xs text-gray-600">v2.0 · Círculo Italiano</p>
        </div>
      </aside>

      {/* Main content area */}
      <main class="ml-64 flex-1 min-h-screen">
        {/* Top bar */}
        <header class="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <span class="text-gray-400">Panel</span>
            <span>/</span>
            <span class="font-medium capitalize text-gray-700">
              {location.url.pathname.replace("/admin", "").replace(/\//g, "") ||
                "Dashboard"}
            </span>
          </nav>
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
              <span class="text-xs font-bold uppercase text-green-500">
                {userEmail.charAt(0)}
              </span>
            </div>
            <span class="text-sm font-medium capitalize text-gray-700">
              {userEmail.split("@")[0]}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div class="p-8">
          {accessDenied ? <AccessDenied /> : <Slot />}
        </div>
      </main>
    </div>
  );
});
