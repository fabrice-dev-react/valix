import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET() {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const competitors = [
      ...(userData.competitors || []).map((c: any) => ({
        id: c.name?.toLowerCase().replace(/\s+/g, "-") || c.website,
        name: c.name,
        domain: c.website || c.name?.toLowerCase().replace(/\s+/g, "") + ".com",
        rating: 3.5 + Math.random() * 1.5
      })),
      ...(userData.customCompetitors || []).map((c: any) => ({
        id: c.domain?.replace(/\./g, "-") || c.url,
        name: c.name,
        domain: c.domain || c.url,
        rating: 3.5 + Math.random() * 1.5
      }))
    ];

    return NextResponse.json({ competitors });
  } catch (error) {
    console.error("Get competitors error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to access this resource");
    }

    const { name, url, domain } = await request.json();

    await connectDB();

    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingCompetitor = (userData.competitors || []).find((c: any) => c.name?.toLowerCase() === name?.toLowerCase()) ||
                              (userData.customCompetitors || []).find((c: any) => c.domain === domain);

    if (existingCompetitor) {
      return NextResponse.json({ message: "Competitor already exists" }, { status: 400 });
    }

    await User.findByIdAndUpdate(user._id, {
      $push: {
        customCompetitors: {
          name,
          url: url || `https://${domain}`,
          domain: domain
        }
      }
    });

    return NextResponse.json({ message: "Competitor added successfully" });
  } catch (error) {
    console.error("Add competitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
