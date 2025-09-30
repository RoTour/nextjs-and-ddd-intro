"use client";
import React, { memo } from "react";

type Props = {
  color: string;
  colIndex: number;
  rowIndex: number;
  onClick: (rowIndex: number, colIndex: number) => void;
};

const Pixel = ({ color, onClick, rowIndex, colIndex }: Props) => {
  // console.count(`Rendering pixel: ${color}`);
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

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
  // This function should return TRUE if the props are equal, and FALSE if they are not.
  // Returning false will trigger a re-render.

  const propsAreEqual =
    prevProps.color === nextProps.color &&
    prevProps.onClick === nextProps.onClick;

  if (!propsAreEqual) {
    console.log(
      `Pixel [${nextProps.rowIndex}, ${nextProps.colIndex}] is re-rendering because:`,
      {
        colorChanged: prevProps.color !== nextProps.color,
        onClickChanged: prevProps.onClick !== nextProps.onClick,
      },
    );
  }

  return propsAreEqual;
};

// Pass our custom comparison function as the second argument to memo.
export default memo(Pixel);
