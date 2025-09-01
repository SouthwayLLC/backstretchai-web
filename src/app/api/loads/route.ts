import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([{ ok: true, note: "loads route reachable" }]);
}

export async function POST() {
  return NextResponse.json({ ok: true, note: "POST reachable" });
}
