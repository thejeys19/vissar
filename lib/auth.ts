import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail } from "@/lib/db";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        // Use custom name from DB if set, otherwise fall back to token name
        if (token.customName) {
          session.user.name = token.customName as string;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        // On first sign-in, load custom name from DB
        if (user.email) {
          try {
            const dbUser = await getUserByEmail(user.email);
            if (dbUser?.name) token.customName = dbUser.name;
          } catch {}
        }
      }
      // When update() is called from the client with a new name
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
