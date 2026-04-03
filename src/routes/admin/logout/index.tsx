import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = ({ cookie, redirect }) => {
  cookie.delete("admin_session", { path: "/" });
  throw redirect(302, "/admin/login");
};
