import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/?login=1");
  }

  let onboardingCompleted = session.user.onboardingCompleted;

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("onboardingCompleted").lean();
    if (user) {
      onboardingCompleted = user.onboardingCompleted || false;
    }
  } catch (error) {
    console.error("Dashboard onboarding check failed:", error);
  }

  if (!onboardingCompleted) {
    redirect("/onboarding");
  }

  return children;
}