import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user.toObject(),
    _id: user._id.toString(),
  };
}

export async function getAuthUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const extUser = session.user as unknown as { id?: string; name?: string; email?: string; onboardingCompleted?: boolean; plan?: string };

  return {
    id: extUser.id || "",
    name: extUser.name || null,
    email: extUser.email || null,
    onboardingCompleted: extUser.onboardingCompleted,
    plan: extUser.plan,
  };
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function getAuthenticatedUserId(): Promise<string> {
  const user = await requireAuth();
  return user.id;
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}
