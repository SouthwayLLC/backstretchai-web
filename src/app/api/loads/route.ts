import { NextRequest, NextResponse } from "next/server";
// If your tsconfig has the @/* alias, use the next line.
// import { prisma } from "@/lib/prisma";
// If not, use this relative import instead:
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const loads = await prisma.load.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(loads);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, origin, destination, weightLbs, miles } = body ?? {};
    if (!customer || !origin || !destination) {
      return NextResponse.json({ error: "customer, origin, destination required" }, { status: 400 });
    }

    // make a simple incremental ref like L-000001
    const last = await prisma.load.findFirst({
      orderBy: { createdAt: "desc" },
      select: { ref: true },
    });
    let n = 0;
    if (last?.ref) {
      const m = last.ref.match(/L-(\d+)/);
      if (m) n = parseInt(m[1], 10);
    }
    const ref = `L-${String(n + 1).padStart(6, "0")}`;

    const created = await prisma.load.create({
      data: {
        ref,
        customer,
        origin,
        destination,
        weightLbs: weightLbs ? Number(weightLbs) : null,
        miles: miles ? Number(miles) : null,
        status: "DRAFT",
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
