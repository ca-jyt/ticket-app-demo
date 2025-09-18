export type Movie = {
  id: string;
  title: string;
  synopsis: string;
  durationMin: number;
};

export type Showtime = {
  id: string;
  movieId: string;
  startTimeIso: string;
  auditorium: string;
  capacity: number;
  reserved: number;
};

export const movies: Movie[] = [
  { id: "m1", title: "Space Odyssey 2049", synopsis: "未知の宇宙を巡る壮大な旅。", durationMin: 128 },
  { id: "m2", title: "The Last Samurai Cat", synopsis: "侍猫の最後の戦い。", durationMin: 102 },
  { id: "m3", title: "Ocean Echoes", synopsis: "海の記憶を辿るドラマ。", durationMin: 112 },
];

function inHours(h: number) {
  return new Date(Date.now() + h * 3600_000).toISOString();
}

export const showtimes: Showtime[] = [
  { id: "s1", movieId: "m1", startTimeIso: inHours(1), auditorium: "Screen 1", capacity: 120, reserved: 18 },
  { id: "s2", movieId: "m1", startTimeIso: inHours(3), auditorium: "Screen 2", capacity: 100, reserved: 88 },
  { id: "s3", movieId: "m2", startTimeIso: inHours(2), auditorium: "Screen 1", capacity: 120, reserved: 120 },
  { id: "s4", movieId: "m2", startTimeIso: inHours(5), auditorium: "Screen 3", capacity: 80, reserved: 20 },
  { id: "s5", movieId: "m3", startTimeIso: inHours(4), auditorium: "Screen 2", capacity: 100, reserved: 55 },
];

export type Availability = "余裕あり" | "残席わずか" | "完売";

export function availabilityOf(st: Showtime): Availability {
  const remaining = st.capacity - st.reserved;
  if (remaining <= 0) return "完売";
  const ratio = remaining / st.capacity; // remaining ratio
  if (ratio <= 0.1) return "残席わずか";
  return "余裕あり";
}

export function remainingSeats(st: Showtime): number {
  return Math.max(0, st.capacity - st.reserved);
}


