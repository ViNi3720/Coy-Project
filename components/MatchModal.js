"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MatchModal({ profile, onClose }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-6 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-rose-400"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        It&apos;s a match! 🎉
      </motion.h2>
      <p className="mt-2 text-white/80">
        You and {profile.name} liked each other
      </p>
      <img
        src={profile.photo}
        alt={profile.name}
        className="mt-6 h-40 w-40 rounded-full border-4 border-rose-400 object-cover"
      />

      <Link
        href="/discover/matches"
        className="mt-8 w-full rounded-full bg-rose-500 py-3 font-semibold"
      >
        View matches
      </Link>
      <button
        onClick={onClose}
        className="mt-3 w-full rounded-full border border-white/40 py-3"
      >
        Keep swiping
      </button>
    </motion.div>
  );
}
