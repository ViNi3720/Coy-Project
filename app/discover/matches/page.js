"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MatchesList from "@/components/MatchesList";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMatches(data.matches);
      } catch {
        setError("Matches load nahi hue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function resetDemo() {
    if (!confirm("Saare swipes aur matches reset karne hain?")) return;
    await fetch("/api/reset", { method: "POST" });
    window.location.href = "/discover";
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 py-3">
        <Link
          href="/discover"
          className="text-sm font-semibold text-neutral-600"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-extrabold text-rose-500">Matches</h1>
        <button onClick={resetDemo} className="text-xs text-neutral-400">
          Reset demo
        </button>
      </header>

      {loading ? (
        <p className="pt-20 text-center text-neutral-400">Loading...</p>
      ) : error ? (
        <p className="pt-20 text-center text-red-500">{error}</p>
      ) : matches.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl">💔</div>
          <h2 className="mt-4 text-xl font-bold">No matches yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Keep swiping, a match appears when you both like each other.
          </p>
          <Link
            href="/discover"
            className="mt-6 rounded-full bg-rose-500 px-6 py-2 font-semibold text-white"
          >
            Go to Discover
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <MatchesList matches={matches} />
        </div>
      )}
    </div>
  );
}
