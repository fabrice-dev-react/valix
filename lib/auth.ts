import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCheckoutSession, getPayment, isPaidStatus } from "@/lib/payments";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboardingCompleted?: boolean;
      hasPaid?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    onboardingCompleted?: boolean;
    hasPaid?: boolean;
  }
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
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account && token.email) {
        await connectDB();

        let existingUser = await User.findOne({ email: token.email });

        if (!existingUser) {
          existingUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
            provider: "google",
            onboardingCompleted: false,
          });
        }

        token.id = existingUser._id.toString();
        token.onboardingCompleted = existingUser.onboardingCompleted;
        token.hasPaid = existingUser.hasPaid || false;

        if (!token.hasPaid) {
          try {
            const storedSessionId =
              typeof existingUser.dodoCheckoutSessionId === "string"
                ? existingUser.dodoCheckoutSessionId
                : null;
            const storedPaymentId =
              typeof existingUser.lastPaymentId === "string"
                ? existingUser.lastPaymentId
                : null;

            const ownsPayment = (payment: {
              status: string | null;
              metadata?: Record<string, string | number | boolean>;
            }) => {
              const metaUserId =
                typeof payment.metadata?.user_id === "string"
                  ? payment.metadata.user_id
                  : null;
              return (
                isPaidStatus(payment.status) &&
                (!metaUserId || metaUserId === existingUser._id.toString())
              );
            };

            let healed = false;
            if (storedPaymentId) {
              const payment = await getPayment(storedPaymentId);
              if (ownsPayment(payment)) healed = true;
            }
            if (!healed && storedSessionId) {
              const session = await getCheckoutSession(storedSessionId);
              let sessionPaid = isPaidStatus(session.payment_status);
              if (sessionPaid && session.payment_id) {
                const payment = await getPayment(session.payment_id);
                if (!ownsPayment(payment)) sessionPaid = false;
              }
              if (sessionPaid) healed = true;
            }

            if (healed && !existingUser.hasPaid) {
              existingUser.hasPaid = true;
              existingUser.plan = "pro";
              existingUser.paymentDate = new Date();
              await existingUser.save();
              console.log(`[dodo] sign-in heal: ${existingUser.email} marked as paid`);
            }
            token.hasPaid = existingUser.hasPaid || false;
          } catch (error: unknown) {
            console.error(
              "Sign-in payment heal error:",
              error instanceof Error ? error.message : error
            );
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.onboardingCompleted = token.onboardingCompleted;
        session.user.hasPaid = token.hasPaid;
      }
      return session;
    },
  },
};
