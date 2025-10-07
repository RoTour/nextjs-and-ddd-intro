"use client";

import { Color } from "@/pixelwar-context/domain/Cell.entity";

type Props = {
  colorsAvailable: Color[];
  colorChanged: (newColor: Color) => void;
  currentColor: string;
};

const ColorPicker = ({
  colorChanged,
  colorsAvailable,
  currentColor,
}: Props) => {
  return (
    <div className="my-4 flex justify-center gap-2">
      {colorsAvailable.map((color) => (
        <div
          key={color}
          onClick={() => colorChanged(color)}
          className={`h-8 w-8 cursor-pointer rounded-full border-4 ${
            currentColor === color ? "border-blue-500" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
