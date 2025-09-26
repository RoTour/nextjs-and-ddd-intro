"use client";
import React, { memo } from "react";

type Props = {
  color: string;
  colIndex: number;
  rowIndex: number;
  onClick: (rowIndex: number, colIndex: number) => void;
};

const Pixel = ({ color, onClick, rowIndex, colIndex }: Props) => {
  console.count(`Rendering pixel: ${color}`);
  const handleClick = () => {
    onClick(rowIndex, colIndex);
  };
  return (
    <button
      className="h-5 w-5 border border-gray-400"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    ></button>
  );
};

export default memo(Pixel);
