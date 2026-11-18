"use client";

export default function ActionButtons({ onPass, onLike, disabled }) {
  return (
    <div className="flex items-center justify-center gap-8 py-4">
      <button
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-white text-3xl text-red-500 shadow-md transition active:scale-90 disabled:opacity-40"
      >
        ✕
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        aria-label="Like"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-3xl text-white shadow-md transition active:scale-90 disabled:opacity-40"
      >
        ♥
      </button>
    </div>
  );
}
