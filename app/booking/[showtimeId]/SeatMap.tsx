"use client";

import { SeatId, SeatMap as SeatMapType } from "../types";

type Props = {
  seatMap: SeatMapType;
  selected: SeatId[];
  onToggle: (seatId: SeatId) => void;
};

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function SeatMap({ seatMap, selected, onToggle }: Props) {
  const grouped: Record<string, { id: SeatId; status: string }[]> = {};
  Object.entries(seatMap).forEach(([id, status]) => {
    const [row] = id.split("-");
    grouped[row] ||= [];
    grouped[row].push({ id: id as SeatId, status });
  });
  const rows = Object.keys(grouped).sort();
  rows.forEach((r) => grouped[r].sort((a, b) => Number(a.id.split("-")[1]) - Number(b.id.split("-")[1])));

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center text-sm text-gray-500">スクリーン</div>
      <div className="mx-auto h-2 w-56 bg-gray-200 rounded" />
      <div className="grid gap-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-6 text-right text-sm text-gray-500">{row}</div>
            <div className="flex gap-2">
              {grouped[row].map(({ id, status }) => {
                const isSelected = selected.includes(id);
                const disabled = status !== "available" && !isSelected;
                return (
                  <button
                    key={id}
                    disabled={disabled}
                    onClick={() => onToggle(id)}
                    className={classNames(
                      "w-8 h-8 rounded text-xs",
                      disabled && "bg-gray-300 text-gray-500 cursor-not-allowed",
                      status === "available" && !isSelected && "bg-green-100 hover:bg-green-200",
                      isSelected && "bg-blue-500 text-white"
                    )}
                    aria-label={`Seat ${id} ${status}`}
                    title={`${id}`}
                  >
                    {id.split("-")[1]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-200"/>空席</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-500"/>選択中</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-gray-300"/>予約済</div>
      </div>
    </div>
  );
}


