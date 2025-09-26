"use client";
import React, { useCallback, useState } from "react";
import Pixel from "./Pixel";

type Grid = string[][];

const PixelArtCanvas = () => {
  const WIDTH = 32;
  const HEIGHT = 32;
  const INITIAL_COLOR = "lightgray";
  const createInitialGrid = () => {
    return Array.from({ length: HEIGHT }, () => {
      return Array(WIDTH).fill(INITIAL_COLOR);
    });
  };

  const handleClick = useCallback((rowIndex: number, colIndex: number) => {
    setGrid((previousGrid) => {
      const newGrid = previousGrid.map((row) => [...row]);
      newGrid[rowIndex][colIndex] = "pink";
      return newGrid;
    });
  }, []);
  const [grid, setGrid] = useState<Grid>(createInitialGrid());
  return (
    <div
      className={`grid`}
      style={{ gridTemplateColumns: `repeat(${WIDTH}, 20px)` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <Pixel
            key={`${rowIndex}-${colIndex}`}
            color={color}
            rowIndex={rowIndex}
            colIndex={colIndex}
            onClick={handleClick}
          ></Pixel>
        )),
      )}
    </div>
  );
};

export default PixelArtCanvas;
