"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";

// animation lgate hai ke like pe right ho aur left pe skip type ka
const variants = {
  exit: (dir) => ({
    x: dir === "like" ? 500 : -500,
    rotate: dir === "like" ? 25 : -25,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

export default function SwipeCard({ profile, onSwipe, exitDir }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > 120 || info.velocity.x > 600) onSwipe("like");
    else if (info.offset.x < -120 || info.velocity.x < -600) onSwipe("pass");
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none overflow-hidden rounded-3xl bg-neutral-900 shadow-lg active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      variants={variants}
      custom={exitDir}
      exit="exit"
    >
      <img
        src={profile.photo}
        alt={profile.name}
        draggable={false}
        className="h-full w-full object-cover"
      />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute left-5 top-6 -rotate-12 rounded-lg border-4 border-green-400 px-3 py-1 text-2xl font-extrabold text-green-400"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute right-5 top-6 rotate-12 rounded-lg border-4 border-red-400 px-3 py-1 text-2xl font-extrabold text-red-400"
      >
        NOPE
      </motion.div>

      {/*  Neeche info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16 text-white">
        <h2 className="text-2xl font-bold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-sm text-white/80">📍 {profile.city}</p>
        <p className="mt-2 text-sm">{profile.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <span
              key={i}
              className="rounded-full bg-white/20 px-3 py-1 text-xs"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
