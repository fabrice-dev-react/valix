import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

const HISTORY_LIMIT = 100;

type HistoryMsg = { role: "user" | "assistant"; content: string };

export async function GET() {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to load chat history");
    }

    await connectDB();

    const messages = await ChatMessage.find({ user: authUser.id })
      .sort({ createdAt: 1, _id: 1 })
      .limit(HISTORY_LIMIT)
      .select("role content -_id")
      .lean();

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    console.error("Load chat history error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to save messages");
    }

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const incoming: { role?: string; content?: string }[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    const docs = incoming
      .filter(
        (m): m is HistoryMsg =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({ user: authUser.id, role: m.role, content: m.content.trim() }));

    if (docs.length === 0) {
      return NextResponse.json({ ok: true, saved: 0 });
    }

    const inserted = await ChatMessage.insertMany(docs);

    return NextResponse.json({ ok: true, saved: inserted.length });
  } catch (error: unknown) {
    console.error("Save chat messages error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}