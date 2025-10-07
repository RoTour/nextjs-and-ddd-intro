"use server";

import { ChangePixelColorUseCase } from "@/application/ChangePixelColor.usecase";
import { GetCurrentGridOrCreateNewOneUseCase } from "@/application/GetCurrentGridOrCreateNewOne.usecase";
import { CanvasPageQueries } from "@/application/queries/CanvasPageQueries";
import { Color } from "@/domain/Cell.entity";
import { DomainEventPublisher } from "@/domain/common/events/DomainEventPublisher";
import { HttpBroadcaster } from "@/infrastructure/broadcasting/HttpBroadcaster";
import { GridUpdateBroadcaster } from "@/infrastructure/listeners/GridUpdateBroadcaster";
import { prisma } from "@/infrastructure/prisma";
import { PrismaGridQueries } from "@/infrastructure/queries/PrismaGridQueries";
import { PrismaGridRepository } from "@/infrastructure/repositories/PrismaGridRepository";
import { revalidatePath } from "next/cache";

const gridRepository = new PrismaGridRepository(prisma);
const gridQueries = new PrismaGridQueries(prisma);

// Setup the event-driven broadcasting.
// When a use case publishes a domain event, this listener will be triggered.
const broadcaster = new HttpBroadcaster();
const gridUpdateListener = new GridUpdateBroadcaster(broadcaster);
DomainEventPublisher.subscribe(gridUpdateListener);

export async function changePixelColorAction(
  x: number,
  y: number,
  color: Color,
  gridIdStr: string,
  playerIdStr: string,
) {
  try {
    const usecase = new ChangePixelColorUseCase(gridRepository);
    await usecase.execute({ x, y, color, gridIdStr, playerIdStr });
  } catch (error) {
    console.error("Error changing pixel color:", (error as Error).message);
    return { error: (error as Error).message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function getCurrentGridOrCreateNewOne() {
  const usecase = new GetCurrentGridOrCreateNewOneUseCase(
    gridRepository,
    gridQueries,
  );
  try {
    const grid = await usecase.execute();
    // const gameData: {
    //   grid: string[][];
    //   gridId: string;
    // } = { grid: [], gridId: "" };
    // gameData.gridId = grid.id.id();
    // for (let y = 0; y < grid.gridHeight(); y++) {
    //   const row = [];
    //   for (let x = 0; x < grid.gridWidth(); x++) {
    //     row.push(grid.cellAt(x, y).currentColor());
    //   }
    //   gameData.grid.push(row);
    // }
    console.log("Grid retrieved or created:", grid.gridId);
    return { grid };
  } catch (error) {
    console.error("Error getting or creating grid:", error);
    return { error: (error as Error).message };
  }
}

export async function getCanvasPageData() {
  try {
    const canvasPageQueries = new CanvasPageQueries(gridQueries);
    const { grid } = await canvasPageQueries.getPageData();
    return {
      grid,
    };
  } catch (error) {
    console.error("Error getting canvas page data:", error);
    return {
      error: (error as Error).message,
    };
  }
}
