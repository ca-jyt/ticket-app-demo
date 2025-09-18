import Link from "next/link";
import { movies, showtimes, availabilityOf, remainingSeats } from "../../schedule/mock";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function StatusChip({ label }: { label: string }) {
  const color = label === "完売" ? "bg-gray-300" : label === "残席わずか" ? "bg-yellow-200" : "bg-green-200";
  return <span className={`px-2 py-0.5 rounded text-sm ${color}`}>{label}</span>;
}

export default function MovieDetailPage({ params }: { params: { movieId: string } }) {
  const movie = movies.find((m) => m.id === params.movieId);
  if (!movie) return <div className="p-6">Not found</div>;
  const sts = showtimes.filter((s) => s.movieId === movie.id);
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <div className="text-gray-600 text-sm">{movie.durationMin}分</div>
        </div>
        <Link href="/movies" className="text-blue-600 underline">一覧に戻る</Link>
      </div>
      <p className="text-sm text-gray-700">{movie.synopsis}</p>
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">上映スケジュール</h2>
        <div className="flex flex-col gap-2">
          {sts.map((st) => {
            const av = availabilityOf(st);
            return (
              <Link key={st.id} href={`/showtimes/${st.id}`} className="border rounded p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span>{formatTime(st.startTimeIso)}</span>
                  <StatusChip label={av} />
                  <span className="text-xs text-gray-500">残 {remainingSeats(st)}</span>
                </div>
                <span className="text-blue-600">空席状況を見る →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


