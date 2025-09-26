"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Pixel from "./Pixel";
import ColorPicker from "./ColorPicker";

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

  const [grid, setGrid] = useState<Grid>(createInitialGrid());
  const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "black",
    "white",
    "lightgray",
  ];
  const [currentColor, setCurrentColor] = useState<string>(colors[0]);

  // changes in ref are NOT tracked, so the handleClick callback is not
  // recreated when color is changed.
  const colorRef = useRef(currentColor);
  useEffect(() => {
    colorRef.current = currentColor;
  }, [currentColor]);

  const handleClick = useCallback((rowIndex: number, colIndex: number) => {
    setGrid((previousGrid) => {
      const newGrid = previousGrid.map((row) => [...row]);
      newGrid[rowIndex][colIndex] = colorRef.current;
      return newGrid;
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <ColorPicker
        colorChanged={setCurrentColor}
        colorsAvailable={colors}
        currentColor={currentColor}
      ></ColorPicker>
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
    </div>
  );
};

export default PixelArtCanvas;
