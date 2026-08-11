import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import Meeting from "@/models/Meeting";
import { isValidBookingDate, isValidSlot, MEETING_TOPIC } from "@/lib/meetings";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

    let body: { date?: unknown; slot?: unknown; topic?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const date = typeof body.date === "string" ? body.date : "";
    const slot = typeof body.slot === "string" ? body.slot : "";

    if (!isValidBookingDate(date)) {
      return NextResponse.json({ error: "That date is not available" }, { status: 400 });
    }

    if (!isValidSlot(slot)) {
      return NextResponse.json({ error: "That time is not available" }, { status: 400 });
    }

    await connectDB();

    const existing = await Meeting.findOne({ date, slot, status: "booked" }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "That time was just booked. Please pick another." },
        { status: 409 }
      );
    }

    const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim() : MEETING_TOPIC;

    try {
      const meeting = await Meeting.create({
        userId: token.id,
        name: typeof token.name === "string" ? token.name : "",
        email: typeof token.email === "string" ? token.email : "",
        date,
        slot,
        topic,
      });
      return NextResponse.json({ ok: true, meeting });
    } catch (error: unknown) {
      if (error instanceof Error && (error as { code?: number }).code === 11000) {
        return NextResponse.json(
          { error: "That time was just booked. Please pick another." },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error("Meeting booking error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Unable to book the meeting. Please try again." },
      { status: 503 }
    );
  }
}
