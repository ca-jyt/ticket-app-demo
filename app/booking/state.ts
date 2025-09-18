"use client";

import { MAX_SEATS_PER_BOOKING, SeatId } from "./types";

export type BookingDraft = {
  showtimeId: string;
  seatIds: SeatId[];
  holdExpiresAt: number | null; // epoch ms
};

export function createEmptyDraft(showtimeId: string): BookingDraft {
  return { showtimeId, seatIds: [], holdExpiresAt: null };
}

export function toggleSeatInDraft(draft: BookingDraft, seatId: SeatId): BookingDraft {
  const exists = draft.seatIds.includes(seatId);
  if (exists) {
    const next = { ...draft, seatIds: draft.seatIds.filter((s) => s !== seatId) };
    if (next.seatIds.length === 0) next.holdExpiresAt = null;
    return next;
  }
  if (draft.seatIds.length >= MAX_SEATS_PER_BOOKING) return draft;
  const now = Date.now();
  const holdMs = 2 * 60 * 1000;
  return {
    ...draft,
    seatIds: [...draft.seatIds, seatId],
    holdExpiresAt: draft.holdExpiresAt && draft.holdExpiresAt > now ? draft.holdExpiresAt : now + holdMs,
  };
}

export function isHoldActive(draft: BookingDraft): boolean {
  return !!draft.holdExpiresAt && draft.holdExpiresAt > Date.now();
}


