import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";
import { UserRepository } from "@/server/repositories/user.repository";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const identifier = credentials.identifier.trim().toLowerCase();
        
        // Find user by email in database
        const user = await UserRepository.findByEmail(identifier);

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare password hash
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        if (user.role === "AMBASSADOR" && user.status === "PENDING_APPROVAL") {
          throw new Error("Your ambassador account is pending admin approval.");
        }

        if (user.status === "INACTIVE" || user.status === "SUSPENDED") {
          throw new Error("Your account is currently inactive. Contact system administrator.");
        }

        // Parse User Agent & IP for Security Logs
        let ipAddress = "127.0.0.1";
        let userAgentStr = "";
        
        if (req && req.headers) {
          ipAddress = (req.headers["x-forwarded-for"] as string) || (req.headers["x-real-ip"] as string) || "127.0.0.1";
          userAgentStr = (req.headers["user-agent"] as string) || "";
        }
        
        const parser = new UAParser(userAgentStr);
        const browser = parser.getBrowser().name || "Unknown Browser";
        const os = parser.getOS().name || "Unknown OS";

        // Log login asynchronously
        prisma.loginLog.create({
          data: {
            userId: user.id,
            ipAddress,
            browser,
            os,
            location: "College Campus",
          }
        }).catch(console.error);

        // Update last login
        prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        }).catch(console.error);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          forcePasswordChange: user.forcePasswordChange,
          emailVerified: user.emailVerified,
          canDeductCredits: user.canDeductCredits,
          rememberMe: credentials.rememberMe === 'true',
          hasProfile: !!user.studentProfile || !!user.adminProfile || !!user.ambassadorProfile
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.forcePasswordChange = (user as any).forcePasswordChange;
        token.emailVerified = (user as any).emailVerified;
        token.canDeductCredits = (user as any).canDeductCredits;
        token.rememberMe = (user as any).rememberMe;
        token.hasProfile = (user as any).hasProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).forcePasswordChange = token.forcePasswordChange;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).canDeductCredits = token.canDeductCredits;
        (session.user as any).rememberMe = token.rememberMe;
        (session.user as any).hasProfile = token.hasProfile;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  }
};
