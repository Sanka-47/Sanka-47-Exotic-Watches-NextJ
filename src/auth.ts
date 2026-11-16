import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
import { adminEmails, env } from "@/lib/env";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "USER";
      }
      return session;
    },
    async signIn({ user }) {
      if (!user.id || !user.email) return true;

      // Promote allow-listed emails on every sign-in so existing accounts can be
      // granted admin access without touching the database by hand.
      if (adminEmails.has(user.email.toLowerCase()) && user.role !== "ADMIN") {
        await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      if (adminEmails.has(user.email.toLowerCase())) {
        await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      }
    },
  },
});
