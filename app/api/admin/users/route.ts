import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

const ADMIN_COOKIE = "admin_auth";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function getAdminData() {
  await connectDB();

  const users = await User.find({})
    .select("email name createdAt hasPaid saasProfile")
    .sort({ createdAt: -1 });

  const totalUsers = users.length;
  const briefsSubmitted = users.filter((u) => !!u.saasProfile?.submittedAt).length;
  const payingUsers = users.filter((u) => u.hasPaid).length;

  return {
    totalUsers,
    briefsSubmitted,
    payingUsers,
    users: users.map((u) => ({
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      hasPaid: u.hasPaid,
      brief: u.saasProfile?.submittedAt
        ? {
            productName: u.saasProfile.productName || "",
            websiteUrl: u.saasProfile.websiteUrl || "",
            notes: u.saasProfile.notes || "",
            contactMethod: u.saasProfile.contactMethod || "",
            contactDetail: u.saasProfile.contactDetail || "",
            submittedAt: u.saasProfile.submittedAt,
          }
        : null,
    })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const data = await getAdminData();

    const response = NextResponse.json({ success: true, ...data });
    response.cookies.set(ADMIN_COOKIE, hashPassword(adminPassword), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie !== hashPassword(adminPassword)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getAdminData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}