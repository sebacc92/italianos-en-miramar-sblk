import { routeLoader$ } from "@builder.io/qwik-city";

export const useLogout = routeLoader$(({ cookie, redirect }) => {
  cookie.delete("admin_session", { path: "/" });
  throw redirect(302, "/admin/login");
});
