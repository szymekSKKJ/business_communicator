import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";

export type sessionUser = {
  id: string;
  publicId: string;
  description: string;
  name: string;
  email: string;
};

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: "670213861568-3rmf81shqktenkg586mllce46d42vfov.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }: { account: any }) {
      return true;
    },
    async session({ session }: any) {
      if (session) {
        const userData = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        if (userData) {
          session.user.id = userData.id;
          session.user.publicId = userData.publicId!;
          session.user.description = userData.description!;
          session.user.name = userData.name!;
          session.user.email = userData.email!;
        }

        return session;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
