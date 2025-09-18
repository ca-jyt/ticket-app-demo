"use client";

import Link from "next/link";
import { useMemo } from "react";
import { movies, showtimes } from "../../../schedule/mock";

function useQueryParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export default function ConfirmPage({ params }: { params: { showtimeId: string } }) {
  const showtime = showtimes.find((s) => s.id === params.showtimeId)!;
  const movie = movies.find((m) => m.id === showtime.movieId)!;
  const seatParam = useQueryParam("seats") || "";
  const seats = useMemo(() => (seatParam ? seatParam.split(".") : []), [seatParam]);

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">予約が完了しました</h1>
      <div className="border rounded p-4 flex flex-col gap-2">
        <div className="font-medium">{movie.title}</div>
        <div className="text-sm text-gray-600">{new Date(showtime.startTimeIso).toLocaleString()}</div>
        <div className="text-sm">座席: {seats.join(", ")}</div>
        <div className="text-sm">予約番号: MOCK-{showtime.id.toUpperCase()}</div>
      </div>
      <div className="flex gap-4">
        <Link href={`/movies/${movie.id}`} className="text-blue-600 underline">作品に戻る</Link>
        <Link href="/movies" className="text-blue-600 underline">映画一覧へ</Link>
      </div>
    </div>
  );
}


