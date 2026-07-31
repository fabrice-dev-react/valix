import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

export async function GET() {
  const dir = path.join(process.cwd(), "public", "images");
  try {
    const files = await fs.readdir(dir);
    const images = files
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/api/images/${encodeURIComponent(f)}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
