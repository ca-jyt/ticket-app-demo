"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SeatMap from "./SeatMap";
import { movies, showtimes } from "../../schedule/mock";
import { MAX_SEATS_PER_BOOKING, SeatId } from "../types";
import { createEmptyDraft, isHoldActive, toggleSeatInDraft, BookingDraft } from "../state";
import { mockSeatMapForShowtime } from "../mockSeat";

export default function SeatSelectionPage({ params }: { params: { showtimeId: string } }) {
  const showtime = showtimes.find((s) => s.id === params.showtimeId)!;
  const movie = movies.find((m) => m.id === showtime.movieId)!;
  const baseSeatMap = useMemo(() => mockSeatMapForShowtime(showtime.id), [showtime.id]);
  const [draft, setDraft] = useState<BookingDraft>(() => createEmptyDraft(showtime.id));
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const remainingMs = draft.holdExpiresAt ? Math.max(0, draft.holdExpiresAt - now) : 0;
  const canProceed = draft.seatIds.length > 0 && isHoldActive(draft);

  function handleToggle(id: SeatId) {
    if (baseSeatMap[id] !== "available" && !draft.seatIds.includes(id)) return;
    setDraft((d) => toggleSeatInDraft(d, id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">座席を選択</h1>
          <div className="text-gray-600 text-sm">{movie.title} ・ {new Date(showtime.startTimeIso).toLocaleString()}</div>
        </div>
        <Link href={`/showtimes/${showtime.id}`} className="text-blue-600 underline">空席状況へ戻る</Link>
      </div>

      <SeatMap seatMap={baseSeatMap} selected={draft.seatIds} onToggle={handleToggle} />

      <div className="flex items-center justify-between border rounded p-4">
        <div className="text-sm text-gray-700">
          選択中: {draft.seatIds.join(", ") || "なし"}（最大 {MAX_SEATS_PER_BOOKING} 席）
        </div>
        <div className="flex items-center gap-4">
          {draft.seatIds.length > 0 && (
            <span className="text-sm">仮予約 残り: {Math.ceil(remainingMs / 1000)} 秒</span>
          )}
          <Link
            className={`px-4 py-2 rounded ${canProceed ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            href={canProceed ? `/booking/${showtime.id}/checkout?seats=${encodeURIComponent(draft.seatIds.join("."))}&exp=${draft.holdExpiresAt}` : "#"}
            aria-disabled={!canProceed}
          >
            次へ（確認）
          </Link>
        </div>
      </div>
      <p className="text-xs text-gray-500">注: このモックでは仮予約はクライアント側のみで再現しています（2分）。</p>
    </div>
  );
}


