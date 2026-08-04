import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";
import { sendSecurityEmail, sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";
import { UserRepository } from "@/server/repositories/user.repository";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days ("Remember Me" duration by default for now)
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email / ID / Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // --- MOCKUP LOGIN (Bypasses Database) ---
        // Accept any password for these specific emails for testing
        if (credentials.identifier === "student@sonatech.ac.in") {
          return {
            id: "mock-student-123",
            email: "student@sonatech.ac.in",
            name: "Mock Student",
            role: "PARTICIPANT",
            forcePasswordChange: false,
            emailVerified: true,
            canDeductCredits: false,
            rememberMe: credentials.rememberMe === 'true',
            hasProfile: true
          };
        }
        if (credentials.identifier === "admin@sonatech.ac.in") {
          return {
            id: "mock-admin-123",
            email: "admin@sonatech.ac.in",
            name: "Mock Admin",
            role: "ADMIN",
            forcePasswordChange: false,
            emailVerified: true,
            canDeductCredits: true,
            rememberMe: credentials.rememberMe === 'true',
            hasProfile: true
          };
        }
        if (credentials.identifier === "ambassador@sonatech.ac.in") {
          return {
            id: "mock-ambassador-123",
            email: "ambassador@sonatech.ac.in",
            name: "Mock Ambassador",
            role: "AMBASSADOR",
            forcePasswordChange: false,
            emailVerified: true,
            canDeductCredits: false,
            rememberMe: credentials.rememberMe === 'true',
            hasProfile: true
          };
        }
        
        // Mockup Backdoor for UI Testing without DB
        if (credentials.password === "mockup") {
          let mockRole = "PARTICIPANT";
          let mockName = "Siva Mathesh (Mock Student)";
          
          if (credentials.identifier.includes("admin")) {
            mockRole = "ADMIN";
            mockName = "Admin User (Mock)";
          } else if (credentials.identifier.includes("ambassador")) {
            mockRole = "AMBASSADOR";
            mockName = "Ambassador User (Mock)";
          }

          return {
            id: `mock-user-${mockRole.toLowerCase()}`,
            email: credentials.identifier,
            name: mockName,
            role: mockRole,
            forcePasswordChange: false,
            emailVerified: true,
            canDeductCredits: false,
            rememberMe: false,
            hasProfile: true
          };
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@sonatech\.ac\.in$/;
        if (!emailRegex.test(credentials.identifier)) {
          throw new Error("Only official college email addresses are permitted.");
        }
        
        throw new Error("Mockup mode active: Use student@sonatech.ac.in, admin@sonatech.ac.in, or ambassador@sonatech.ac.in (any password)");
        // --- END MOCKUP LOGIN ---

        /*
        const emailRegex = /^[a-zA-Z0-9._%+-]+@sonatech\.ac\.in$/;
        if (!emailRegex.test(credentials.identifier)) {
          throw new Error("Only official college email addresses are permitted.");
        }

        const user = await UserRepository.findByEmail(credentials.identifier);

        if (!user) throw new Error("Invalid credentials");
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        if (user.role === "AMBASSADOR" && user.status === "PENDING_APPROVAL") {
          throw new Error("Your ambassador account is pending admin approval.");
        }

        // Parse User Agent & IP for Security
        let ipAddress = "Unknown";
        let userAgentStr = "";
        
        if (req && req.headers) {
          ipAddress = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "Unknown";
          userAgentStr = req.headers["user-agent"] || "";
        }
        
        const parser = new UAParser(userAgentStr);
        const browser = parser.getBrowser().name || "Unknown Browser";
        const os = parser.getOS().name || "Unknown OS";

        // Check last 5 logins for suspicious activity
        const recentLogins = await prisma.loginLog.findMany({
          where: { userId: user.id },
          orderBy: { loginAt: 'desc' },
          take: 5
        });

        const isNewIP = !recentLogins.some(log => log.ipAddress === ipAddress);
        const isNewDevice = !recentLogins.some(log => log.browser === browser && log.os === os);
        const isSuspicious = recentLogins.length > 0 && isNewIP && isNewDevice;

        await prisma.loginLog.create({
          data: {
            userId: user.id,
            ipAddress,
            browser,
            os,
            location: "Approximate", // In production, use GeoIP service
            isSuspicious
          }
        });

        // Fire and forget security email
        // We will implement this safely later
        sendSecurityEmail({
          email: user.email,
          name: user.name,
          ipAddress,
          browser,
          os,
          isSuspicious
        }).catch(err => console.error("Email failed:", err));

        // Check if first login
        if (!user.lastLogin) {
          const verificationToken = generateVerificationToken(user.email);
          sendVerificationEmail(user.email, verificationToken).catch(err => console.error("Verification email failed:", err));
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          forcePasswordChange: user.forcePasswordChange,
          emailVerified: user.emailVerified,
          canDeductCredits: user.canDeductCredits,
          rememberMe: credentials.rememberMe === 'true',
          hasProfile: !!user.studentProfile
        };
        */
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
