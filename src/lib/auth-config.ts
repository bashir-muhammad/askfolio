import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const requiredEnv = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"] as const;

for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key]?.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};
