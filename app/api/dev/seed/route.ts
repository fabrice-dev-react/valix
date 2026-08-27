import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is only available in development" },
      { status: 403 }
    );
  }

  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    await connectDB();
    const user = await User.findById(authUser._id);

    // Mark the demo user's phone as connected for a realistic preview.
    if (user && user.phoneStatus !== "connected") {
      user.phoneStatus = "connected";
      user.phoneConnectedAt = new Date();
      if (!user.phoneNumber) user.phoneNumber = "+1 (512) 555-0100";
      await user.save();
    }

    const now = Date.now();
    const minutes = (n: number) => new Date(now - n * 60000);

    const samples = [
      {
        name: "Sarah Mitchell",
        phone: "+1 (512) 555-0142",
        platform: "Missed call",
        missedAt: minutes(12),
        summary: "Called to book an emergency drain unclog tonight.",
        intent: "Emergency service — needs same-day dispatch.",
        nextBestAction: "Call back immediately — she&apos;s ready to book.",
        status: "hot",
        conversation: [
          { role: "caller", text: "Hi, this is Sarah Mitchell. Our kitchen sink is backing up and water is starting to leak into the cabinet below.", at: minutes(12) },
          { role: "ai", text: "I&apos;m sorry to hear that, Sarah. That definitely sounds urgent. Let me get you scheduled right away — would tonight work?", at: minutes(11) },
          { role: "caller", text: "Yes, the sooner the better. We have guests coming tomorrow morning.", at: minutes(10.5) },
          { role: "ai", text: "Understood. I&apos;ll flag this as an emergency and get the earliest available dispatch slot. Is this the best number to reach you?", at: minutes(10) },
        ],
        timeline: [
          { type: "call", title: "Missed call", detail: "Caller dialed your business line.", at: minutes(12) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Identified intent: emergency drain service.", at: minutes(10) },
          { type: "status", title: "Marked as hot", at: minutes(9) },
        ],
      },
      {
        name: "Marcus Reed",
        phone: "+1 (737) 555-0188",
        platform: "Missed call",
        missedAt: minutes(58),
        summary: "Wants a quote for a full bathroom remodel.",
        intent: "Estimate request — comparing options.",
        nextBestAction: "Call back during business hours with a quote.",
        status: "warm",
        conversation: [
          { role: "caller", text: "Hi, I&apos;m calling about getting a quote for remodeling our main bathroom.", at: minutes(58) },
          { role: "ai", text: "Great question. We&apos;d love to help with that. Could you share a rough idea of the size and what you&apos;re looking to change?", at: minutes(57) },
          { role: "caller", text: "It&apos;s a full bath, maybe 8 by 10. We&apos;d want new tile, vanity, and a walk-in shower.", at: minutes(56) },
          { role: "ai", text: "Perfect, that helps a lot. I&apos;ll have our team prepare a detailed estimate and call you back with options.", at: minutes(55) },
        ],
        timeline: [
          { type: "call", title: "Missed call", at: minutes(58) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Interested in remodeling estimate.", at: minutes(55) },
        ],
      },
      {
        name: "Dana Whitfield",
        phone: "+1 (512) 555-0199",
        platform: "Missed call",
        missedAt: minutes(150),
        summary: "New patient inquiry for a cleaning appointment.",
        intent: "Booking — asked for availability this week.",
        nextBestAction: "Call back to confirm this week&apos;s availability.",
        status: "new",
        conversation: [
          { role: "caller", text: "Hello, I&apos;d like to book a teeth cleaning appointment this week if possible.", at: minutes(150) },
          { role: "ai", text: "We&apos;d be happy to get you in. I see we have availability later this week — is there a specific day or time you prefer?", at: minutes(149) },
          { role: "caller", text: "Thursday morning would be ideal.", at: minutes(148) },
        ],
        timeline: [
          { type: "call", title: "Missed call", at: minutes(150) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Requested cleaning appointment.", at: minutes(148) },
        ],
      },
      {
        name: "Tom Alvarez",
        phone: "+1 (512) 555-0117",
        platform: "Missed call",
        missedAt: minutes(300),
        summary: "Follow-up on a previous service quote.",
        intent: "Sales follow-up — ready to move forward.",
        nextBestAction: "Call to close the deal.",
        status: "contacted",
        conversation: [
          { role: "caller", text: "Hi, I&apos;m following up on the quote you sent me last week. I think we&apos;re ready to move forward.", at: minutes(300) },
          { role: "ai", text: "That&apos;s wonderful news! Congratulations on moving forward. I&apos;ll make sure our team gives you a call to finalize the details and get you booked.", at: minutes(299) },
          { role: "caller", text: "Sounds good. Thursday works for us.", at: minutes(298) },
        ],
        timeline: [
          { type: "call", title: "Missed call", at: minutes(300) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Wants to proceed with service.", at: minutes(298) },
          { type: "call", title: "Call back logged", detail: "You called Tom and spoke briefly.", at: minutes(120) },
        ],
      },
      {
        name: "Priya Shah",
        phone: "+1 (210) 555-0169",
        platform: "Missed call",
        missedAt: minutes(480),
        summary: "Asked about weekend availability.",
        intent: "General information — not urgent.",
        nextBestAction: "No urgent follow-up needed.",
        status: "lost",
        conversation: [
          { role: "caller", text: "Hi, do you happen to be open on Saturdays?", at: minutes(480) },
          { role: "ai", text: "We are — we offer Saturday appointments. Would you like me to help you find a time?", at: minutes(479) },
          { role: "caller", text: "Just checking, thanks for the info.", at: minutes(478) },
        ],
        timeline: [
          { type: "call", title: "Missed call", at: minutes(480) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Non-urgent question.", at: minutes(478) },
          { type: "status", title: "Marked as lost", at: minutes(200) },
        ],
      },
      {
        name: "Leo Campos",
        phone: "+1 (512) 555-0133",
        platform: "Missed call",
        missedAt: minutes(720),
        summary: "Looking for a quote for landscaping.",
        intent: "Estimate request.",
        nextBestAction: "Call during business hours.",
        status: "warm",
        conversation: [
          { role: "caller", text: "Hi, I&apos;m looking for a landscaping quote for our backyard.", at: minutes(720) },
          { role: "ai", text: "Happy to help! Could you tell me a bit about the size and what you have in mind for the space?", at: minutes(719) },
          { role: "caller", text: "Medium backyard, we want new turf and some flower beds.", at: minutes(718) },
        ],
        timeline: [
          { type: "call", title: "Missed call", at: minutes(720) },
          { type: "conversation", title: "Valix answered &amp; qualified", detail: "Landscaping quote requested.", at: minutes(718) },
        ],
      },
    ];

    // Idempotent-ish: clear existing seeded demo leads for this user first so the
    // preview isn't cluttered with duplicates on repeated calls.
    await Lead.deleteMany({ userId: authUser._id, "timeline.type": { $in: ["conversation"] } });

    const docs = samples.map((s) => ({ userId: authUser._id, ...s }));
    await Lead.insertMany(docs);

    return NextResponse.json({ ok: true, count: docs.length });
  } catch (error: unknown) {
    console.error("Seed error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
