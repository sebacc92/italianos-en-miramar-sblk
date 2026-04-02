import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width={2}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/admin/eventos",
    label: "Eventos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width={2}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/cursos",
    label: "Cursos de Idiomas",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width={2}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/admin/servicios",
    label: "Servicios y Cultura",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width={2}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default component$(() => {
  const location = useLocation();

  const isLoginPage = location.url.pathname.startsWith("/admin/login");

  if (isLoginPage) {
    return <Slot />;
  }

  const userEmail = "Admin";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
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
          <Slot />
        </div>
      </main>
    </div>
  );
});
