import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

const CONTACT_METHODS = ["whatsapp", "email", "phone", "telegram"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

const MAX_URL_LEN = 500;
const MAX_DETAIL_LEN = 200;
const MAX_NOTES_LEN = 4000;

const clean = (v: unknown, max = MAX_URL_LEN) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function GET() {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const p = (user.saasProfile || {}) as Record<string, unknown>;

    return NextResponse.json({
      intake: {
        productName: p.productName ?? "",
        websiteUrl: p.websiteUrl ?? "",
        notes: p.notes ?? "",
        contactMethod: p.contactMethod ?? "whatsapp",
        contactDetail: p.contactDetail ?? "",
      },
      hasPaid: user.hasPaid || false,
      submittedAt: p.submittedAt ?? null,
    });
  } catch (error: unknown) {
    console.error(
      "Get intake error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in");
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const productName = clean(body.productName, 120);
    const websiteUrl = clean(body.websiteUrl);
    const notes = clean(body.notes, MAX_NOTES_LEN);
    const contactDetail = clean(body.contactDetail, MAX_DETAIL_LEN);
    const rawMethod = clean(body.contactMethod, 40) as ContactMethod;
    const contactMethod = CONTACT_METHODS.includes(rawMethod) ? rawMethod : "whatsapp";

    if (!productName) {
      return NextResponse.json(
        { error: "Please add your SaaS name" },
        { status: 400 }
      );
    }

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Please add your SaaS URL" },
        { status: 400 }
      );
    }

    if (!/^https?:\/\/.+/i.test(websiteUrl)) {
      return NextResponse.json(
        { error: "SaaS URL should start with http:// or https://" },
        { status: 400 }
      );
    }

    if (!contactDetail) {
      return NextResponse.json(
        { error: "Please add a way to reach you" },
        { status: 400 }
      );
    }

    if (contactMethod === "email" && !isEmail(contactDetail)) {
      return NextResponse.json(
        { error: "That email doesn't look right" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(
      authUser.id,
      {
        "saasProfile.productName": productName,
        "saasProfile.websiteUrl": websiteUrl,
        "saasProfile.notes": notes,
        "saasProfile.contactMethod": contactMethod,
        "saasProfile.contactDetail": contactDetail,
        "saasProfile.submittedAt": new Date(),
        name: user.name || productName,
        productName,
        websiteUrl,
      },
      { new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error(
      "Save intake error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}