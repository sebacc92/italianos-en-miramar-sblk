import type { RequestHandler } from '@builder.io/qwik-city';

export const onRequest: RequestHandler = async ({ url, cookie, redirect }) => {
  // Solo protegemos las rutas que empiezan con /admin
  if (!url.pathname.startsWith('/admin')) {
    return;
  }

  const isLoginRoute = url.pathname === '/admin/login' || url.pathname === '/admin/login/';
  const sessionCookie = cookie.get('admin_session');

  // Si no hay sesión y NO está en el login, lo echamos al login
  if (!sessionCookie && !isLoginRoute) {
    throw redirect(302, '/admin/login');
  }

  // Si ya hay sesión y quiere entrar al login, lo mandamos al dashboard
  if (sessionCookie && isLoginRoute) {
    throw redirect(302, '/admin');
  }
};
