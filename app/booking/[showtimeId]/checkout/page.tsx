"use client";

import Link from "next/link";
import { useMemo } from "react";
import { movies, showtimes } from "../../../schedule/mock";

function useQueryParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export default function CheckoutPage({ params }: { params: { showtimeId: string } }) {
  const showtime = showtimes.find((s) => s.id === params.showtimeId)!;
  const movie = movies.find((m) => m.id === showtime.movieId)!;
  const seatParam = useQueryParam("seats") || "";
  const expParam = useQueryParam("exp");
  const seats = useMemo(() => (seatParam ? seatParam.split(".") : []), [seatParam]);
  const totalCents = seats.length * showtime.priceCents;
  const holdExpired = expParam ? Number(expParam) <= Date.now() : true;

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">予約内容の確認</h1>
      <div className="border rounded p-4 flex flex-col gap-2">
        <div className="font-medium">{movie.title}</div>
        <div className="text-sm text-gray-600">{new Date(showtime.startTimeIso).toLocaleString()}</div>
        <div className="text-sm">座席: {seats.join(", ") || "なし"}</div>
        <div className="text-sm">料金: ¥{(showtime.priceCents / 100).toFixed(0)} × {seats.length} = <span className="font-semibold">¥{(totalCents / 100).toFixed(0)}</span></div>
      </div>

      {holdExpired && (
        <div className="text-red-600 text-sm">仮予約が失効しました。座席選択に戻ってやり直してください。</div>
      )}

      <div className="flex items-center gap-4">
        <Link href={`/booking/${showtime.id}`} className="text-blue-600 underline">座席に戻る</Link>
        <Link
          href={!holdExpired && seats.length > 0 ? `/booking/${showtime.id}/confirm?seats=${encodeURIComponent(seats.join("."))}` : "#"}
          className={`px-4 py-2 rounded ${!holdExpired && seats.length > 0 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          aria-disabled={holdExpired || seats.length === 0}
        >
          決済して予約を確定（モック）
        </Link>
      </div>
      <p className="text-xs text-gray-500">本モックでは決済はスキップし即時に確定画面へ遷移します。</p>
    </div>
  );
}


