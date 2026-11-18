"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import CardStack from "@/components/CardStack";
import ActionButtons from "@/components/ActionButtons";
import MatchModal from "@/components/MatchModal";
import EmptyState from "@/components/EmptyState";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchProfile, setMatchProfile] = useState(null);
  const [exitDir, setExitDir] = useState("like");

  async function loadFeed() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfiles(data.profiles);
    } catch {
      setError("Profiles load nahi hue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  const handleSwipe = useCallback(
    async (direction) => {
      const top = profiles[0];
      if (!top || matchProfile) return;

      setExitDir(direction);
      setProfiles((prev) => prev.slice(1));
      setError("");

      try {
        const res = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: top.id, direction }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.matched) setMatchProfile(data.profile);
      } catch {
        setProfiles((prev) => [top, ...prev]);
        setError("Swipe save nahi hua, dobara try karo");
      }
    },
    [profiles, matchProfile],
  );

  // left arrow = pass, right arrow = like
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") handleSwipe("like");
      if (e.key === "ArrowLeft") handleSwipe("pass");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwipe]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3">
        <h1 className="text-xl font-extrabold text-rose-500">Discover</h1>
        <Link
          href="/discover/matches"
          className="text-sm font-semibold text-neutral-600"
        >
          💘 Matches
        </Link>
      </header>

      {loading ? (
        <p className="flex-1 pt-20 text-center text-neutral-400">Loading...</p>
      ) : profiles.length === 0 && error ? (
        <div className="flex-1 pt-20 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadFeed}
            className="mt-3 rounded-full bg-rose-500 px-5 py-2 text-white"
          >
            Retry
          </button>
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="relative mx-4 flex-1">
            <CardStack
              profiles={profiles}
              onSwipe={handleSwipe}
              exitDir={exitDir}
            />
          </div>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <ActionButtons
            onPass={() => handleSwipe("pass")}
            onLike={() => handleSwipe("like")}
            disabled={!!matchProfile}
          />
        </>
      )}

      <AnimatePresence>
        {matchProfile && (
          <MatchModal
            profile={matchProfile}
            onClose={() => setMatchProfile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
