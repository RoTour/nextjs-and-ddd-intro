import { Grid } from "@/pixelwar-context/domain/Grid.entity";
import { GridId } from "@/pixelwar-context/domain/GridId.valueObject";
import { IGridRepository } from "@/pixelwar-context/domain/interfaces/IGridRepository";
import { PrismaClient, Grid as PrismaGrid } from "../../../../generated/prisma";
import {
  JsonArray,
  JsonObject,
} from "../../../../generated/prisma/runtime/library";
import { Color } from "@/pixelwar-context/domain/Cell.entity";

type GridCellsData = { x: number; y: number; color: string }[][];
export class PrismaGridMapper {
  static fromDomainToPrisma(grid: Grid): PrismaGrid {
    const primitiveGrid = grid.toPrimitives();
    return {
      id: primitiveGrid.id,
      cells: primitiveGrid.cells as JsonArray,
      playerLastEdits: primitiveGrid.playerLastEdits as unknown as JsonObject,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static fromPrismaToDomain(grid: PrismaGrid): Grid {
    const cellsData = grid.cells as GridCellsData;
    return Grid.reconstitute({
      id: grid.id,
      cells: cellsData as { x: number; y: number; color: Color }[][],
      playerLastEdits: grid.playerLastEdits as { [playerId: string]: string },
    });
  }
}

export class PrismaGridRepository implements IGridRepository {
  prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async findById(id: GridId): Promise<Grid | null> {
    const grid = await this.prisma.grid.findUnique({
      where: { id: id.id() },
    });
    return grid ? PrismaGridMapper.fromPrismaToDomain(grid) : null;
  }

  async save(grid: Grid): Promise<void> {
    // Use the mapper to get the persistence-ready data
    const prismaData = PrismaGridMapper.fromDomainToPrisma(grid);

    await this.prisma.grid.upsert({
      where: { id: grid.id.id() },
      update: {
        cells: prismaData.cells as JsonArray,
        playerLastEdits: prismaData.playerLastEdits as unknown as JsonObject,
      },
      create: {
        id: grid.id.id(),
        cells: prismaData.cells as JsonArray,
        playerLastEdits: prismaData.playerLastEdits as unknown as JsonObject,
      },
    });
  }
}
