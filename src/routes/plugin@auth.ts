import { QwikAuth$ } from "@auth/qwik";
import Credentials from "@auth/qwik/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "~/db/client.server";
import { users } from "~/db/schema.server";
import { eq } from "drizzle-orm";

export const { onRequest, useSession, useSignIn } = QwikAuth$(
  ({ env }: { env: any }) => ({
    providers: [
      Credentials({
        name: "Credenciales",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Contraseña", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const email = credentials.email as string;
          const password = credentials.password as string;

          const db = getDb(env);

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.trim().toLowerCase()));

          if (!user) return null;

          const isValid = bcrypt.compareSync(password, user.passwordHash);

          if (!isValid) return null;

          // Registrar ultimo login if possible, though Auth.js handles basic login, 
          // we can optionally update it here or let the session object hold the required fields
          await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user.id));

          return {
            id: String(user.id),
            email: user.email,
            name: user.email.split("@")[0], // Username representation
          };
        },
      }),
    ],
    pages: {
      signIn: "/admin/login",
    },
    secret: env.get("AUTH_SECRET") || "super-secret-key-for-dev",
    trustHost: true,
  })
);
