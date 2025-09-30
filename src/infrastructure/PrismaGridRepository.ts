import { Cell, Color } from "@/domain/Cell.entity";
import { Grid } from "@/domain/Grid.entity";
import { GridId } from "@/domain/GridId.valueObject";
import { IGridRepository } from "@/domain/interfaces/IGridRepository";
import { Position } from "@/domain/Position.valueObject";
import { PrismaClient, Grid as PrismaGrid } from "../../generated/prisma";
import { JsonArray } from "../../generated/prisma/runtime/library";

type GridCellsData = { x: number; y: number; color: string }[][];
export class PrismaGridMapper {
  static fromDomainToPrisma(grid: Grid): PrismaGrid {
    const primitiveGrid = grid.toPrimitives();
    return {
      id: primitiveGrid.id,
      cells: primitiveGrid.cells as JsonArray,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static fromPrismaToDomain(grid: PrismaGrid): Grid {
    const cellsData = grid.cells as GridCellsData;
    const cells = cellsData.map((row) => {
      return row.map(
        ({ x, y, color }) => new Cell(new Position(x, y), color as Color),
      );
    });
    return Grid.reconstitute(new GridId(grid.id), cells, new Map());
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
      },
      create: {
        id: grid.id.id(),
        cells: prismaData.cells as JsonArray,
      },
    });
  }
}
