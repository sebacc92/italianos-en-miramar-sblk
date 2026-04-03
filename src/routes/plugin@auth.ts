import type { RequestHandler } from '@builder.io/qwik-city';
import { getDb } from '~/db/client.server';
import { users } from '~/db/schema.server';
import { eq } from 'drizzle-orm';

export const onRequest: RequestHandler = async ({ url, cookie, redirect, sharedMap, env }) => {
  if (!url.pathname.startsWith('/admin')) {
    return;
  }

  const isLoginRoute = url.pathname === '/admin/login' || url.pathname === '/admin/login/';
  const sessionCookie = cookie.get('admin_session');

  if (!sessionCookie && !isLoginRoute) {
    throw redirect(302, '/admin/login');
  }

  if (sessionCookie) {
    const db = getDb(env);
    const userId = parseInt(sessionCookie.value, 10);
    
    if (isNaN(userId)) {
      cookie.delete('admin_session', { path: '/' });
      if (!isLoginRoute) throw redirect(302, '/admin/login');
      return;
    }

    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (userRows.length === 0) {
      cookie.delete('admin_session', { path: '/' });
      if (!isLoginRoute) throw redirect(302, '/admin/login');
      return;
    }

    const user = userRows[0];
    sharedMap.set('user', user);

    if (isLoginRoute) {
      throw redirect(302, '/admin');
    }

    // Role verification logic
    // Dashboard (/admin or /admin/) is allowed for everyone so they see the welcome
    const path = url.pathname;
    const isDashboard = path === '/admin' || path === '/admin/';
    
    if (!isDashboard && user.role !== 'ADMIN') {
       // We can map prefixes to roles
       const permissions: Record<string, string> = {
         'DANZAS': '/admin/danzas',
         'NUTRICION': '/admin/nutricion',
         'ARTE': '/admin/arte',
       };

       const allowedPrefix = permissions[user.role as string];
       if (!allowedPrefix || !path.startsWith(allowedPrefix)) {
          // Access Denied! We don't redirect. We pass an error state to be handled by layout/page
          sharedMap.set('access_denied', true);
       }
    }
  }
};
