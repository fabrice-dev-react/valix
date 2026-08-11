import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import Meeting from "@/models/Meeting";
import { isValidBookingDate, isValidSlot, MEETING_TOPIC } from "@/lib/meetings";

export const dynamic = "force-dynamic";

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    let body: { date?: unknown; slot?: unknown; topic?: unknown; name?: unknown; email?: unknown; whatsapp?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const date = cleanString(body.date);
    const slot = cleanString(body.slot);
    const name = cleanString(body.name);
    const email = cleanString(body.email);
    const whatsapp = cleanString(body.whatsapp);

    if (!isValidBookingDate(date)) {
      return NextResponse.json({ error: "That date is not available" }, { status: 400 });
    }

    if (!isValidSlot(slot)) {
      return NextResponse.json({ error: "That time is not available" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (!whatsapp || whatsapp.length < 7) {
      return NextResponse.json({ error: "Please enter your WhatsApp number" }, { status: 400 });
    }

    await connectDB();

    const existing = await Meeting.findOne({ date, slot, status: "booked" }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "That time was just booked. Please pick another." },
        { status: 409 }
      );
    }

    // Optional: link the booking to a signed-in user if one exists.
    let userId: string | undefined;
    try {
      const headersList = await headers();
      const host = headersList.get("host") || "localhost:3000";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const wrapped = new NextRequest(`${protocol}://${host}`, {
        headers: { cookie: headersList.get("cookie") || "" },
      });
      const token = await getToken({ req: wrapped, secret: process.env.NEXTAUTH_SECRET });
      if (token?.id) userId = token.id as string;
    } catch {
      // booking stays anonymous
    }

    const topic =
      cleanString(body.topic) || MEETING_TOPIC;

    try {
      const meeting = await Meeting.create({
        ...(userId ? { userId } : {}),
        name,
        email,
        whatsapp,
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
