export type SeatId = `${string}-${number}`; // e.g., "A-5"
export type SeatStatus = "available" | "held" | "reserved";
export type SeatMap = Record<SeatId, SeatStatus>;
export const MAX_SEATS_PER_BOOKING = 5;


