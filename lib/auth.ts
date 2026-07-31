import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// In a real implementation with Prisma installed, we would use PrismaAdapter and bcryptjs
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Not using adapter because we rely on Custom Credentials
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / ID / Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        /* 
          // Database lookup logic (Placeholder for actual Prisma calls)
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { registerNumber: credentials.identifier }
              ]
            }
          });

          if (!user) throw new Error("Invalid credentials");
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) throw new Error("Invalid credentials");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            forcePasswordChange: user.forcePasswordChange
          };
        */

        // MOCK AUTHENTICATION for scaffolding purposes
        return {
          id: "1",
          name: "Test User",
          email: "test@sonatech.ac.in",
          role: credentials.role || "STUDENT",
          forcePasswordChange: true
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.forcePasswordChange = (user as any).forcePasswordChange;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).forcePasswordChange = token.forcePasswordChange;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  }
};
