import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const req = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      websiteUrl,
      productName,
      productDescription,
      category,
      targetCustomers,
      keyFeatures,
      pricing,
      competitors,
      customCompetitors,
      platforms,
      goals,
      alertFrequency,
      alertDelivery,
    } = body;

    await connectDB();

    const updateData: Record<string, unknown> = {
      onboardingCompleted: true,
      websiteUrl,
      productName,
      productDescription,
      category,
      targetCustomers,
      keyFeatures: keyFeatures || [],
      pricing,
      competitors: competitors?.map((name: string) => ({ name, addedAt: new Date() })) || [],
      customCompetitors: customCompetitors || [],
      platforms: platforms || [],
      goals: goals || [],
      alertFrequency,
      alertDelivery,
    };

    await User.findByIdAndUpdate(token.id, updateData);

    return NextResponse.json({
      message: "Onboarding completed successfully",
    });
  } catch (error: unknown) {
    console.error("Complete onboarding error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
