import Link from "next/link";
import { movies, showtimes, availabilityOf, remainingSeats } from "../../schedule/mock";

function StatusChip({ label }: { label: string }) {
  const color = label === "完売" ? "bg-gray-300" : label === "残席わずか" ? "bg-yellow-200" : "bg-green-200";
  return <span className={`px-2 py-0.5 rounded text-sm ${color}`}>{label}</span>;
}

export default function ShowtimePage({ params }: { params: { showtimeId: string } }) {
  const st = showtimes.find((s) => s.id === params.showtimeId);
  if (!st) return <div className="p-6">Not found</div>;
  const movie = movies.find((m) => m.id === st.movieId)!;
  const av = availabilityOf(st);
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">空席状況</h1>
          <div className="text-gray-600 text-sm">{movie.title} ・ {new Date(st.startTimeIso).toLocaleString()}</div>
        </div>
        <Link href={`/movies/${movie.id}`} className="text-blue-600 underline">作品詳細に戻る</Link>
      </div>
      <div className="border rounded p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusChip label={av} />
          <span className="text-sm text-gray-600">残 {remainingSeats(st)} / {st.capacity}</span>
        </div>
        <Link className={`px-4 py-2 rounded ${av === "完売" ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"}`} href={av === "完売" ? "#" : `/booking/${st.id}`} aria-disabled={av === "完売"}>
          座席を選ぶ
        </Link>
      </div>
      <p className="text-xs text-gray-500">注: 本モックでは空席数を概算表示しています（座席選択は未接続）。</p>
    </div>
  );
}


