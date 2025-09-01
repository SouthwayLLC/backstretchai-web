import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LoadsPage() {
  const loads = await prisma.load.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Loads</h1>
          <Link href="/loads/new" className="rounded-xl border px-4 py-2 hover:bg-blue-50 text-blue-700">
            + New Load
          </Link>
        </div>
        <div className="mt-6 grid gap-3">
          {loads.map(l => (
            <div key={l.id} className="rounded-xl border p-4">
              <div className="text-sm text-neutral-600">{l.ref}</div>
              <div className="text-lg font-semibold">
                {l.origin} → {l.destination} {l.miles ? `• ${l.miles} mi` : ""}
              </div>
              <div className="text-sm text-neutral-700">
                Customer: {l.customer} • Status: {l.status} • {l.weightLbs ? `${l.weightLbs} lbs` : ""}
              </div>
            </div>
          ))}
          {loads.length === 0 && <div className="text-neutral-600">No loads yet.</div>}
        </div>
      </section>
    </main>
  );
}
