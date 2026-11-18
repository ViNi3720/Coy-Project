export default function MatchesList({ matches }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {matches.map((m) => (
        <div
          key={m.id}
          className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 shadow"
        >
          <img
            src={m.photo}
            alt={m.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-white">
            <p className="font-bold">
              {m.name}, {m.age}
            </p>
            <p className="text-xs text-white/80">📍 {m.city}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
