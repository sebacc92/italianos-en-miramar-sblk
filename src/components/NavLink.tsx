import { Slot, component$ } from "@builder.io/qwik";
import { Link, useLocation, type LinkProps } from "@builder.io/qwik-city";

type NavLinkProps = LinkProps & { activeClass?: string };

export const NavLink = component$(({ activeClass, ...props }: NavLinkProps) => {
  const location = useLocation();
  const toPathname = props.href ?? "";
  const locationPathname = location.url.pathname;

  // Extract the path after the locale (e.g., "/en/projects" -> "/projects")
  const pathWithoutLocale = locationPathname.replace(/^\/[a-z]{2}/, "");
  const hrefWithoutLocale = toPathname.replace(/^\/[a-z]{2}/, "");

  // Check if the current path matches the href (ignoring locale)
  const isActive =
    pathWithoutLocale === hrefWithoutLocale ||
    (pathWithoutLocale === "/" && hrefWithoutLocale === "/") ||
    (pathWithoutLocale.startsWith(hrefWithoutLocale) &&
      (pathWithoutLocale.charAt(hrefWithoutLocale.length) === "/" ||
        pathWithoutLocale.length === hrefWithoutLocale.length));

  return (
    <Link
      {...props}
      class={[props.class, isActive && activeClass ? activeClass : ""]}
    >
      <Slot />
    </Link>
  );
});
