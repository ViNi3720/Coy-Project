"use client";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "./SwipeCard";

export default function CardStack({ profiles, onSwipe, exitDir }) {
  const top = profiles[0];
  const next = profiles[1];

  return (
    <div className="relative h-full w-full">
      {next && (
        <div className="absolute inset-0 scale-95 overflow-hidden rounded-3xl bg-neutral-800 opacity-80">
          <img
            src={next.photo}
            alt=""
            draggable={false}
            className="h-full w-full object-cover opacity-60"
          />
        </div>
      )}

      <AnimatePresence custom={exitDir}>
        {top && (
          <SwipeCard
            key={top.id}
            profile={top}
            onSwipe={onSwipe}
            exitDir={exitDir}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
