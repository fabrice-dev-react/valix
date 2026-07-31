import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type RouteContext = { params: Promise<{ name: string }> };

function detectContentType(buf: Buffer): string {
  if (
    buf.length > 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (buf.length > 12 && buf.toString("latin1", 4, 12) === "ftypavif") return "image/avif";
  if (buf.length > 12 && buf.toString("latin1", 4, 12) === "ftypavis") return "image/avif";
  if (buf.length > 2 && buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (
    buf.length > 12 &&
    buf.toString("latin1", 0, 4) === "RIFF" &&
    buf.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.length > 4 && buf.toString("latin1", 0, 4) === "GIF8") return "image/gif";
  return "application/octet-stream";
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { name } = await params;
  const dir = path.resolve(process.cwd(), "public", "images");
  const file = path.resolve(dir, name);

  if (!file.startsWith(dir + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buf = await fs.readFile(file);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": detectContentType(buf),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
