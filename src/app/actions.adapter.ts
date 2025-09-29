"use server";

import { ChangePixelColorUseCase } from "@/application/ChangePixelColor.usecase";
import { GetCurrentGridOrCreateNewOneUseCase } from "@/application/GetCurrentGridOrCreateNewOne.usecase";
import { InMemoryGridRepository } from "@/infrastructure/InMemoryGridRepository";
import { revalidatePath } from "next/cache";

const gridRepository = new InMemoryGridRepository();

export async function changePixelColorAction(
  x: number,
  y: number,
  color: string,
  gridIdStr: string,
  playerIdStr: string,
) {
  const usecase = new ChangePixelColorUseCase(gridRepository);

  try {
    await usecase.execute({ x, y, color, gridIdStr, playerIdStr });
  } catch (error) {
    console.error("Error changing pixel color:", error);
    return { error: (error as Error).message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function getCurrentGridOrCreateNewOne() {
  const usecase = new GetCurrentGridOrCreateNewOneUseCase(gridRepository);
  try {
    const grid = await usecase.execute();
    const gameData: {
      grid: string[][];
      gridId: string;
    } = { grid: [], gridId: "" };
    gameData.gridId = grid.id.id();
    for (let y = 0; y < grid.gridHeight(); y++) {
      const row = [];
      for (let x = 0; x < grid.gridWidth(); x++) {
        row.push(grid.cellAt(x, y).currentColor());
      }
      gameData.grid.push(row);
    }
    console.log("Grid retrieved or created:", gameData.gridId);
    return { grid: gameData };
  } catch (error) {
    console.error("Error getting or creating grid:", error);
    return { error: (error as Error).message };
  }
}
