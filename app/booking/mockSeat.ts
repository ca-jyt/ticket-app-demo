import { SeatId, SeatMap } from "./types";

export function buildInitialSeatMap(rows: number, seatsPerRow: number): SeatMap {
  const map: SeatMap = {};
  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r);
    for (let s = 1; s <= seatsPerRow; s++) {
      map[`${rowLabel}-${s}` as SeatId] = "available";
    }
  }
  return map;
}

export function mockSeatMapForShowtime(showtimeId: string): SeatMap {
  // Simple deterministic pattern by id hash
  const map = buildInitialSeatMap(8, 12);
  const salt = showtimeId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let idx = 0;
  for (const k of Object.keys(map)) {
    if ((idx + salt) % 11 === 0) map[k as SeatId] = "reserved";
    idx++;
  }
  return map;
}


