import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  onboardingCompleted?: boolean;
  plan?: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends ExtendedUser {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.provider === "google") {
          throw new Error("Please sign in with Google");
        }

        if (!user.isEmailVerified) {
          throw new Error("Please verify your email first. Check your inbox for the verification link.");
        }

        if (credentials.password === "__revalidate__") {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            onboardingCompleted: user.onboardingCompleted,
            plan: user.plan,
          };
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
          plan: user.plan,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        await connectDB();
        
        let existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            isEmailVerified: true,
            onboardingCompleted: false,
          });
        } else if (existingUser.provider !== "google") {
          existingUser.provider = "google";
          existingUser.image = user.image;
          await existingUser.save();
        }
        
        token.id = existingUser._id.toString();
        token.name = existingUser.name;
        token.onboardingCompleted = existingUser.onboardingCompleted;
        token.plan = existingUser.plan;
      } else if (user) {
        token.id = user.id;
        token.name = user.name || "";
        token.onboardingCompleted = (user as ExtendedUser).onboardingCompleted;
        token.plan = (user as ExtendedUser).plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const extSession = session.user as unknown as ExtendedUser & { id: string; name: string };
        extSession.id = token.id;
        extSession.name = token.name || "";
        extSession.onboardingCompleted = token.onboardingCompleted;
        extSession.plan = token.plan;
      }
      return session;
    },
  },
};
