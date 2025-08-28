"use client";
import { useState } from "react";

export default function MilesPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    origin?: string;
    destination?: string;
    miles?: number;
    durationText?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const q = new URLSearchParams({ origin, destination });
      const res = await fetch(`/api/distance?${q.toString()}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Request failed. Check the console and API key." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Miles & Drive Time</h1>
        <p className="mt-2 text-neutral-700">
          Enter an origin and destination to get distance (mi) and ETA. Uses Google Distance Matrix.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Origin (e.g., CLT airport or 28202)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Destination (e.g., RDU or 27601)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !origin || !destination}
            className="rounded-xl bg-blue-700 px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Get Miles"}
          </button>
        </form>

        {result && (
          <div className="mt-6 rounded-xl border p-4">
            {"error" in result ? (
              <p className="text-red-600">Error: {result.error}</p>
            ) : (
              <>
                <p className="text-sm text-neutral-700">
                  {result.origin} → {result.destination}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {result.miles} mi • {result.durationText}
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
