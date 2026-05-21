import { component$, Slot, useSignal } from "@builder.io/qwik";
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
  LuLogOut,
  LuTerminal,
  LuMenu,
  LuX,
  LuBot,
  LuMessageSquare,
  LuCalendarDays,
  LuUserPlus
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
  {
    href: "/admin/ai/settings",
    label: "Ajustes del Asistente",
    icon: <LuBot class="h-5 w-5" />,
  },
  {
    href: "/admin/ai/chats",
    label: "Auditoría de IA",
    icon: <LuMessageSquare class="h-5 w-5" />,
  },
  {
    href: "/admin/reservas",
    label: "Reservas de Salones",
    icon: <LuCalendarDays class="h-5 w-5" />,
  },
  {
    href: "/admin/asociarse",
    label: "Solicitudes de Socios",
    icon: <LuUserPlus class="h-5 w-5" />,
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
  const isSidebarOpen = useSignal(false);

  const isLoginPage = location.url.pathname.startsWith("/admin/login");

  if (isLoginPage) {
    return <Slot />;
  }
  
  const user = adminSession.value.user;
  const userEmail = typeof user?.username === 'string' ? user.username : 'Admin';
  const userName = userEmail.toLowerCase();
  const accessDenied = adminSession.value.accessDenied;

  const isDanzaNutriUser = userName === 'flor' || userName === 'martinap' || userName === 'martina';
  const isArteUser = userName === 'natalia';
  const isSalonAdmin = userName === 'seba' || userName === 'laura' || userName === 'mary';

  let currentNavLinks = [...navLinks];

  if (isDanzaNutriUser) {
    const nutriIndex = currentNavLinks.findIndex(l => l.href === '/admin/nutricion');
    if (nutriIndex !== -1) {
      const nutriLink = currentNavLinks.splice(nutriIndex, 1)[0];
      currentNavLinks.unshift(nutriLink);
    }
    const danzasIndex = currentNavLinks.findIndex(l => l.href === '/admin/danzas');
    if (danzasIndex !== -1) {
      const danzasLink = currentNavLinks.splice(danzasIndex, 1)[0];
      currentNavLinks.unshift(danzasLink);
    }
  } else if (isArteUser) {
    const arteIndex = currentNavLinks.findIndex(l => l.href === '/admin/arte');
    if (arteIndex !== -1) {
      const arteLink = currentNavLinks.splice(arteIndex, 1)[0];
      currentNavLinks.unshift(arteLink);
    }
  }

  const displayLinks = currentNavLinks.map(link => {
    let disabled = false;
    if (isDanzaNutriUser && link.href !== '/admin/danzas' && link.href !== '/admin/nutricion' && link.href !== '/admin') {
      disabled = true;
    }
    if (isArteUser && link.href !== '/admin/arte' && link.href !== '/admin') {
      disabled = true;
    }
    if (link.href === '/admin/reservas' && !isSalonAdmin) {
      disabled = true;
    }
    if (link.href === '/admin/asociarse' && !isSalonAdmin) {
      disabled = true;
    }
    return { ...link, disabled };
  });

  return (
    <div class="flex min-h-screen bg-gray-50 font-sans">
      {/* Backdrop */}
      {isSidebarOpen.value && (
        <div 
          class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick$={() => isSidebarOpen.value = false}
        />
      )}

      {/* Sidebar */}
      <aside 
        class={[
          "fixed left-0 top-0 z-50 flex min-h-screen w-64 flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen.value ? "translate-x-0" : "-translate-x-full"
        ]}
      >
        {/* Brand */}
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div class="flex items-center gap-3">
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
          <button 
            onClick$={() => isSidebarOpen.value = false}
            class="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <LuX class="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav class="flex-1 space-y-1 px-3 py-6">
          {displayLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? location.url.pathname === "/admin" ||
                location.url.pathname === "/admin/"
                : location.url.pathname.startsWith(link.href);

            if (link.disabled) {
              return (
                <div
                  key={link.href}
                  class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 opacity-60 cursor-not-allowed"
                  title="No tienes acceso a esta sección"
                  aria-disabled="true"
                >
                  {link.icon}
                  {link.label}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick$={() => isSidebarOpen.value = false}
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
          
          {user?.role === "SUPERADMIN" && (
            <div class="pt-4 mt-4 border-t border-white/10">
              <Link
                href="/admin/cleverisma"
                onClick$={() => isSidebarOpen.value = false}
                class={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  location.url.pathname.startsWith("/admin/cleverisma")
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                    : "text-purple-400 hover:bg-white/10 hover:text-purple-300",
                ].join(" ")}
              >
                <LuTerminal class="h-5 w-5" />
                Cleverisma Core
              </Link>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div class="border-t border-white/10 px-6 py-4">
          <a
            href="/admin/logout"
            class="flex w-full items-center gap-2 text-xs text-gray-400 transition-colors hover:text-red-400"
          >
            <LuLogOut class="h-4 w-4" />
            Cerrar sesión
          </a>
          <p class="mt-2 text-xs text-gray-600">v2.0 · Círculo Italiano</p>
        </div>
      </aside>

      {/* Main content area */}
      <main class="flex-1 min-h-screen transition-all duration-300 lg:ml-64">
        {/* Top bar */}
        <header class="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:px-8">
          <div class="flex items-center gap-4">
            <button
               onClick$={() => isSidebarOpen.value = !isSidebarOpen.value}
               class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
               aria-label="Abrir menú"
             >
               <LuMenu class="h-6 w-6" />
             </button>
            <nav class="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
              <span class="text-gray-400">Panel</span>
              <span>/</span>
              <span class="font-medium capitalize text-gray-700">
                {location.url.pathname.replace("/admin", "").replace(/\//g, "") ||
                  "Dashboard"}
              </span>
            </nav>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden flex-col items-end sm:flex">
              <span class="text-xs font-bold uppercase tracking-wider text-green-600">Admin</span>
              <span class="text-sm font-medium text-gray-700 capitalize">{userEmail.split("@")[0]}</span>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 shadow-lg shadow-gray-900/10 transition-transform hover:scale-105 active:scale-95">
              <span class="text-sm font-bold uppercase text-green-500">
                {userEmail.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div class="p-4 md:p-8">
          {accessDenied ? <AccessDenied /> : <Slot />}
        </div>
      </main>
    </div>
  );
});
