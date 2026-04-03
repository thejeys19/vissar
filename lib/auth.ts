import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, upsertUser } from "@/lib/services/user.service";

// Extend session type
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // Auto-provision user in Postgres on first sign-in
        try {
          await upsertUser({
            id: user.id || user.email,
            email: user.email,
            name: user.name ?? null,
          });
        } catch (err) {
          console.error('Failed to upsert user on sign-in:', err);
          // Don't block sign-in for DB errors
        }
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        if (token.customName) {
          session.user.name = token.customName as string;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        if (user.email) {
          try {
            const dbUser = await getUserByEmail(user.email);
            if (dbUser?.name) token.customName = dbUser.name;
          } catch {}
        }
      }
      if (trigger === "update" && updateData?.name) {
        token.customName = updateData.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
