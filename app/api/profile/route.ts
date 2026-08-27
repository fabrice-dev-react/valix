import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

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

    return NextResponse.json({
      name: user.name || "",
      email: user.email || "",
      picture: user.image || "",
      businessName: user.businessName || "",
      businessType: user.businessType || "",
      services: user.services || [],
      serviceArea: user.serviceArea || "",
      address: user.address || "",
      businessHours: user.businessHours || { open: "09:00", close: "17:00", days: [] },
      emergencyService: user.emergencyService || false,
      aiInstructions: user.aiInstructions || "",
      aiTone: user.aiTone || "professional",
      phoneNotifications: user.phoneNotifications || { callbacks: true, email: true },
      phoneStatus: user.phoneStatus || "not_connected",
      phoneNumber: user.phoneNumber || "",
      hasPaid: user.hasPaid || false,
    });
  } catch (error: unknown) {
    console.error("Get profile error:", error instanceof Error ? error.message : error);
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

    const body = await request.json();
    await connectDB();

    const allowed = [
      "businessName",
      "businessType",
      "services",
      "serviceArea",
      "address",
      "businessHours",
      "emergencyService",
      "aiInstructions",
      "aiTone",
      "phoneNotifications",
    ];

    const updateData: Record<string, unknown> = {};
    for (const f of allowed) {
      if (body[f] !== undefined) updateData[f] = body[f];
    }

    await User.findByIdAndUpdate(authUser.id, updateData);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Update profile error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
