import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl">🌙</div>
      <h2 className="mt-4 text-xl font-bold">You&apos;re all caught up</h2>
      <p className="mt-2 text-sm text-neutral-500">
        No more profiles for now. Check back later!
      </p>
      <Link
        href="/discover/matches"
        className="mt-6 rounded-full bg-rose-500 px-6 py-2 font-semibold text-white"
      >
        See your matches
      </Link>
    </div>
  );
}
