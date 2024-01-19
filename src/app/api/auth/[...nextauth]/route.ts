import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";
import { user } from "@/types";

const authOptions = {
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
    async session({ session, user }: any) {
      const userData = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      session.user.id = user.id;
      session.user.publicId = userData?.publicId;
      session.user.description = userData?.description;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
