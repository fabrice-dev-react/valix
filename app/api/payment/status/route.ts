import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const req = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req });

    if (!token?.id) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(token.id).select("hasPaid plan paymentDate email");

    return NextResponse.json({
      hasPaid: user?.hasPaid || false,
      plan: user?.plan || "pro",
      paymentDate: user?.paymentDate ? user.paymentDate.toISOString() : null,
      email: user?.email || null,
    });
  } catch (error: unknown) {
    console.error("Payment status error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to check payment status. Please try again." },
      { status: 503 }
    );
  }
}
