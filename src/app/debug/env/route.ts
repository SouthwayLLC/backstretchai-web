import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY || "";
  return NextResponse.json({
    present: Boolean(key),
    length: key.length,
    tail: key ? key.slice(-6) : null, // last 6 chars, safe to show
  });
}
