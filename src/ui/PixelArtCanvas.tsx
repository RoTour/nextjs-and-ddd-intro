"use client";
import {
  changePixelColorAction,
  getCurrentGridOrCreateNewOne,
} from "@/app/actions.adapter";
import { availableColors } from "@/domain/Cell.entity";
import { PlayerId } from "@/domain/PlayerId.valueObject";
import { useCallback, useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useWebSocket } from "./context/WebSocketContext";
import Pixel from "./Pixel";

type GameData = {
  gridId: string;
  grid: string[][];
};

const PixelArtCanvas = () => {
  const [grid, setGrid] = useState<GameData | null>(null);
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [currentPlayerId] = useState(() => new PlayerId().id());
  useEffect(() => {
    const fetchGrid = async () => {
      const result = await getCurrentGridOrCreateNewOne();

      if (result.error) {
        console.error(result.error);
        return;
      } else if (result.grid) {
        setGrid(result.grid);
      }
    };

    fetchGrid();
  }, []);

  const changeCellColor = useCallback(
    async (
      rowIndex: number,
      colIndex: number,
      color: string,
      gridId: string,
    ) => {
      console.log(rowIndex, colIndex, color, gridId, currentPlayerId);
      const result = await changePixelColorAction(
        rowIndex,
        colIndex,
        color,
        gridId,
        currentPlayerId,
      );

      if (result.error) {
        throw result.error;
      }
      console.log("Pixel color changed successfully", result);
    },
    [currentPlayerId],
  );

  const [currentColor, setCurrentColor] = useState<string>(availableColors[0]);
  const { sendMessage } = useWebSocket();
  // changes in ref are NOT tracked, so the handleClick callback is not
  // recreated when color is changed.
  const colorRef = useRef(currentColor);
  useEffect(() => {
    colorRef.current = currentColor;
  }, [currentColor]);

  const handleClick = useCallback(
    (rowIndex: number, colIndex: number) => {
      const currentGrid = gridRef.current;
      if (!currentGrid) return;

      const oldColor = currentGrid.grid[rowIndex][colIndex];
      const newColor = colorRef.current;

      //Optimistic UI update
      setGrid((previousGrid) => {
        if (!previousGrid) return previousGrid;
        const newGrid = previousGrid.grid.map((row) => [...row]);
        newGrid[rowIndex][colIndex] = newColor;
        sendMessage(`Item at [${rowIndex}:${colIndex}] => ${newColor}`);
        return {
          ...previousGrid,
          grid: newGrid,
        };
      });

      changeCellColor(
        rowIndex,
        colIndex,
        colorRef.current,
        currentGrid.gridId,
      ).catch(() => {
        console.debug("Error caught on changeCellColor");
        // reverse optimistic update
        setGrid((previousGrid) => {
          if (!previousGrid) return previousGrid;
          const newGrid = previousGrid.grid.map((row) => [...row]);
          newGrid[rowIndex][colIndex] = oldColor;
          return {
            ...previousGrid,
            grid: newGrid,
          };
        });
      });
    },
    [changeCellColor, sendMessage],
  );

  return (
    <div className="flex flex-col items-center">
      <ColorPicker
        colorChanged={setCurrentColor}
        colorsAvailable={[...availableColors]}
        currentColor={currentColor}
      ></ColorPicker>
      <div
        className={`grid`}
        style={{
          gridTemplateColumns: `repeat(${grid?.grid.length ?? 0}, 20px)`,
        }}
      >
        {grid?.grid?.map((row, rowIndex) =>
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
