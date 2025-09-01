"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLoadPage() {
  const [customer, setCustomer] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weightLbs, setWeightLbs] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const q = new URLSearchParams({ origin, destination });
      const distRes = await fetch(`/api/distance?${q.toString()}`);
      const dist = await distRes.json();
      const miles = dist?.miles ?? null;

      const res = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, origin, destination, weightLbs, miles }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/loads");
    } catch (err) {
      console.error(err);
      alert("Failed to create load.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Create Load</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input className="rounded-xl border px-4 py-3" placeholder="Customer"
                 value={customer} onChange={e=>setCustomer(e.target.value)} />
          <input className="rounded-xl border px-4 py-3" placeholder="Origin"
                 value={origin} onChange={e=>setOrigin(e.target.value)} />
          <input className="rounded-xl border px-4 py-3" placeholder="Destination"
                 value={destination} onChange={e=>setDestination(e.target.value)} />
          <input className="rounded-xl border px-4 py-3" placeholder="Weight (lbs)" type="number"
                 value={weightLbs} onChange={e=>setWeightLbs(e.target.value === "" ? "" : Number(e.target.value))} />
          <button disabled={loading || !customer || !origin || !destination}
                  className="rounded-xl bg-blue-700 px-5 py-3 text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save Load"}
          </button>
        </form>
      </section>
    </main>
  );
}
