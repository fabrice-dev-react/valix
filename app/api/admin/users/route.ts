import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).select("email name plan createdAt isEmailVerified").sort({ createdAt: -1 });

    const totalUsers = users.length;
    const paidUsers = users.filter((u: any) => u.plan === "starter" || u.plan === "growth").length;
    const freeUsers = totalUsers - paidUsers;
    const verifiedUsers = users.filter((u: any) => u.isEmailVerified).length;

    return NextResponse.json({
      totalUsers,
      paidUsers,
      freeUsers,
      verifiedUsers,
      users: users.map((u: any) => ({
        email: u.email,
        name: u.name,
        plan: u.plan,
        isPaid: u.plan === "starter" || u.plan === "growth",
        createdAt: u.createdAt,
        isEmailVerified: u.isEmailVerified,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
