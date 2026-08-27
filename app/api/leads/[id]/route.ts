import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse } from "@/lib/authHelpers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    const { id } = await params;
    await connectDB();
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    if (lead.userId.toString() !== authUser._id) {
      return forbiddenResponse("This lead does not belong to your account");
    }

    return NextResponse.json({
      lead: {
        id: lead._id.toString(),
        name: lead.name || "",
        phone: lead.phone,
        platform: lead.platform || "",
        missedAt: lead.missedAt,
        lastContactedAt: lead.lastContactedAt || undefined,
        summary: lead.summary || "",
        intent: lead.intent || "",
        nextBestAction: lead.nextBestAction || "",
        status: lead.status,
        conversation: (lead.conversation || []).map((c: Record<string, unknown>) => ({
          role: c.role,
          text: c.text || "",
          at: c.at,
        })),
        timeline: (lead.timeline || []).map((t: Record<string, unknown>) => ({
          type: t.type,
          title: t.title || "",
          detail: t.detail || "",
          at: t.at,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("Get lead error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    const body = await request.json();
    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    if (lead.userId.toString() !== authUser._id) {
      return forbiddenResponse("This lead does not belong to your account");
    }

    const validStatuses = ["new", "hot", "warm", "contacted", "lost"];
    if (body.status && validStatuses.includes(body.status)) {
      lead.status = body.status;
      lead.timeline.push({
        type: "status",
        title: `Marked as ${body.status}`,
        at: new Date(),
      });
      if (body.status === "contacted") {
        lead.lastContactedAt = new Date();
        lead.timeline.push({ type: "call", title: "Call back logged", at: new Date() });
      }
      await lead.save();
    }

    return NextResponse.json({
      lead: {
        id: lead._id.toString(),
        status: lead.status,
        timeline: (lead.timeline || []).map((t: Record<string, unknown>) => ({
          type: t.type,
          title: t.title || "",
          detail: t.detail || "",
          at: t.at,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("Update lead error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
