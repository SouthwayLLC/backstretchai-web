import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Query params 'origin' and 'destination' are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API_KEY on the server." },
      { status: 500 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("units", "imperial");
  url.searchParams.set("origins", origin);
  url.searchParams.set("destinations", destination);
  url.searchParams.set("region", "us");
  url.searchParams.set("key", apiKey);

  try {
    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Upstream ${resp.status}`, details: text.slice(0, 1200) },
        { status: 502 }
      );
    }
    const data = await resp.json();
    const el = data?.rows?.[0]?.elements?.[0];
    if (el?.status !== "OK") {
      return NextResponse.json(
        { error: `Distance Matrix status: ${el?.status ?? "UNKNOWN"}`, raw: data },
        { status: 400 }
      );
    }
    const miles = (el.distance.value as number) / 1609.344;
    return NextResponse.json({
      origin: data.origin_addresses?.[0],
      destination: data.destination_addresses?.[0],
      miles: Number(miles.toFixed(1)),
      durationText: el.duration.text as string,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Fetch failed", message: String(err) }, { status: 500 });
  }
}
