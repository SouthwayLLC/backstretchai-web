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
  url.searchParams.set("key", apiKey);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    return NextResponse.json(
      { error: `Distance Matrix request failed: ${resp.status}` },
      { status: 502 }
    );
  }

  const data = await resp.json();

  try {
    const element = data?.rows?.[0]?.elements?.[0];
    const status = element?.status;
    if (status !== "OK") {
      return NextResponse.json(
        { error: `Distance Matrix status: ${status || "UNKNOWN"}`, raw: data },
        { status: 400 }
      );
    }

    const meters = element.distance.value as number; // meters
    const seconds = element.duration.value as number; // seconds
    const miles = meters / 1609.344;
    const durationText = element.duration.text as string;

    return NextResponse.json({
      origin: data?.origin_addresses?.[0],
      destination: data?.destination_addresses?.[0],
      miles: Number(miles.toFixed(1)),
      durationText,
      raw: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not parse Distance Matrix response.", raw: data },
      { status: 500 }
    );
  }
}
