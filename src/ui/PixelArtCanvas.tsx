"use client";
import {
  changePixelColorAction,
  getCurrentGridOrCreateNewOne,
} from "@/app/CanvasPageServerActions.adapter";
import { availableColors, Color } from "@/pixelwar-context/domain/Cell.entity";
import { PlayerId } from "@/pixelwar-context/domain/PlayerId.valueObject";
import { ClientEventGridUpdatedPayload } from "@/pixelwar-context/infrastructure/listeners/GridUpdateBroadcaster";
import { useCallback, useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useSubscription } from "./hooks/useSubscription";
import Pixel from "./Pixel";

type GameData = {
  gridId: string;
  cells: string[][];
};

const updateCellOfLocalGrid = (
  cells: string[][],
  x: number,
  y: number,
  color: string,
): string[][] => {
  const newCells = cells.map((row) => [...row]);
  newCells[y][x] = color;
  return newCells;
};

const PixelArtCanvas = () => {
  const [grid, setGrid] = useState<GameData | null>(null);
  // const [cooldown, setCooldown] = useState<number>(0);
  useSubscription("GRID_UPDATED", (rawPayload) => {
    const data = ClientEventGridUpdatedPayload.safeParse(rawPayload);
    if (!data.success) {
      console.error(
        "Invalid GRID_UPDATED payload",
        rawPayload,
        data.error.issues,
      );
      return;
    }
    const { x, y, newColor, gridId } = data.data;
    console.debug("Received GRID_UPDATED event", event);
    setGrid((oldGameData) => {
      if (!oldGameData) return oldGameData;
      if (oldGameData.gridId !== gridId) return oldGameData;
      const newCells = updateCellOfLocalGrid(oldGameData.cells, x, y, newColor);
      return {
        ...oldGameData,
        cells: newCells,
      };
    });
  });
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [currentPlayerId, setCurrentPlayerId] = useState<PlayerId | null>();
  useEffect(() => {
    const existingUser = localStorage.getItem("playerId");
    if (existingUser) {
      setCurrentPlayerId(new PlayerId(existingUser));
      return;
    }
    const newPlayerId = new PlayerId();
    setCurrentPlayerId(newPlayerId);
    localStorage.setItem("playerId", newPlayerId.toString());
  }, []);

  console.debug("Current Player ID: ", currentPlayerId?.id());
  useEffect(() => {
    const fetchGrid = async () => {
      const result = await getCurrentGridOrCreateNewOne();

      if (result.error) {
        console.error(result.error);
        return;
      } else if (result.grid) {
        setGrid({
          cells: result.grid.cells,
          gridId: result.grid.gridId,
        });
      }
    };

    fetchGrid();
  }, []);

  const changeCellColor = useCallback(
    async (
      rowIndex: number,
      colIndex: number,
      color: Color,
      gridId: string,
    ) => {
      if (!currentPlayerId) {
        throw new Error("No current player ID");
      }
      console.log(rowIndex, colIndex, color, gridId, currentPlayerId);
      const result = await changePixelColorAction(
        colIndex,
        rowIndex,
        color,
        gridId,
        currentPlayerId.id(),
      );

      if (result.error) {
        throw result.error;
      }
      console.log("Pixel color changed successfully", result);
    },
    [currentPlayerId],
  );

  const [currentColor, setCurrentColor] = useState<Color>(availableColors[0]);
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

      const oldColor = currentGrid.cells[rowIndex][colIndex];
      const newColor = colorRef.current;

      //Optimistic UI update
      setGrid((previousGrid) => {
        if (!previousGrid) return previousGrid;
        return {
          ...previousGrid,
          cells: updateCellOfLocalGrid(
            previousGrid.cells,
            colIndex,
            rowIndex,
            newColor,
          ),
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
          return {
            ...previousGrid,
            cells: updateCellOfLocalGrid(
              previousGrid.cells,
              colIndex,
              rowIndex,
              oldColor,
            ),
          };
        });
      });
    },
    [changeCellColor],
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
          gridTemplateColumns: `repeat(${grid?.cells?.length ?? 0}, 20px)`,
        }}
      >
        {grid?.cells?.map((row, rowIndex) =>
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
