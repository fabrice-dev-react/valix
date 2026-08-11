import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import Meeting from "@/models/Meeting";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const wrapped = new NextRequest(`${protocol}://${host}`, {
      headers: { cookie: headersList.get("cookie") || "" },
    });

    const token = await getToken({ req: wrapped, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return NextResponse.json({ error: "Please log in to continue" }, { status: 401 });
    }

    const date = req.nextUrl.searchParams.get("date");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    await connectDB();

    const taken = await Meeting.find({ date, status: "booked" }).select("slot").lean();

    return NextResponse.json({ slots: taken.map((m) => m.slot) });
  } catch (error: unknown) {
    console.error("Meeting availability error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to load availability. Please try again." },
      { status: 503 }
    );
  }
}
