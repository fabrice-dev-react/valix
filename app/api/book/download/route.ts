import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAuthenticatedUser } from "@/lib/authHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOOK_FILE = path.join("files", "30-Day-Managers-Favorite-Employee-1.pdf");
const BOOK_TITLE = "30-Day-Managers-Favorite-Employee.pdf";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user.hasPaid) {
      return NextResponse.json(
        { error: "Purchase required to download this guide" },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "private", BOOK_FILE);
    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${BOOK_TITLE}"`,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Unauthorized" || message === "User not found") {
      return NextResponse.json({ error: "Please log in to download" }, { status: 401 });
    }
    console.error("Book download error:", message || error);
    return NextResponse.json({ error: "Could not download the guide" }, { status: 500 });
  }
}
