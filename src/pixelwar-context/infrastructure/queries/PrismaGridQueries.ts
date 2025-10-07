import { IGridQueries } from "@/application/interfaces/IGridQueries";
import { GridDto } from "@/application/queries/GridDto";
import { PrismaClient } from "../../../generated/prisma";
import { PrismaGridMapper } from "../repositories/PrismaGridRepository";

export class PrismaGridQueries implements IGridQueries {
  constructor(private prisma: PrismaClient) {}

  async findLatestGrid(): Promise<GridDto | null> {
    const grid = await this.prisma.grid.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!grid) {
      return null;
    }

    const primitiveGrid =
      PrismaGridMapper.fromPrismaToDomain(grid).toPrimitives();

    const dto: GridDto = {
      gridId: primitiveGrid.id,
      cells: primitiveGrid.cells.map((row) => {
        return row.map(({ color }) => color);
      }),
    };

    return dto;
  }
}
