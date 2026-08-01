import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();
    await Message.create({
      name: name?.trim() || "",
      email: email?.trim() || "",
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
