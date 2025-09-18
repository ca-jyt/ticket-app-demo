import Link from "next/link";
import { movies, showtimes, availabilityOf, remainingSeats } from "../schedule/mock";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function StatusChip({ label }: { label: string }) {
  const color = label === "完売" ? "bg-gray-300" : label === "残席わずか" ? "bg-yellow-200" : "bg-green-200";
  return <span className={`px-2 py-0.5 rounded text-sm ${color}`}>{label}</span>;
}

export default function MoviesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">上映中の作品</h1>
      <div className="flex flex-col gap-4">
        {movies.map((m) => {
          const sts = showtimes.filter((s) => s.movieId === m.id);
          return (
            <div key={m.id} className="border rounded p-4 flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <Link href={`/movies/${m.id}`} className="text-lg font-medium underline">{m.title}</Link>
                  <div className="text-sm text-gray-600">{m.durationMin}分</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sts.map((st) => {
                  const av = availabilityOf(st);
                  return (
                    <Link key={st.id} href={`/showtimes/${st.id}`} className="border rounded px-3 py-2 flex items-center gap-2 hover:bg-gray-50">
                      <span className="text-sm">{formatTime(st.startTimeIso)}</span>
                      <StatusChip label={av} />
                      <span className="text-xs text-gray-500">残 {remainingSeats(st)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


