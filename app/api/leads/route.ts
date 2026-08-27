import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const query: Record<string, unknown> = { userId: authUser._id };
    if (status === "new" || status === "hot" || status === "warm" || status === "contacted" || status === "lost") {
      query.status = status;
    } else if (status === "active") {
      query.status = { $in: ["new", "hot", "warm"] };
    }

    await connectDB();
    const leads = await Lead.find(query).sort({ missedAt: -1 }).limit(200);

    return NextResponse.json({
      leads: leads.map((l) => ({
        id: l._id.toString(),
        name: l.name || "",
        phone: l.phone,
        platform: l.platform || "",
        missedAt: l.missedAt,
        lastContactedAt: l.lastContactedAt || undefined,
        summary: l.summary || "",
        intent: l.intent || "",
        nextBestAction: l.nextBestAction || "",
        status: l.status,
      })),
      count: leads.length,
    });
  } catch (error: unknown) {
    console.error("List leads error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
