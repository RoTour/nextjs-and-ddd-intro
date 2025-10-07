import { Grid } from "@/pixelwar-context/domain/Grid.entity";
import { IGridRepository } from "@/pixelwar-context/domain/interfaces/IGridRepository";
import { IGridQueries } from "./interfaces/IGridQueries";
import { GridDto } from "./queries/GridDto";

function toDto(grid: Grid): GridDto {
  const primitives = grid.toPrimitives();
  return {
    gridId: primitives.id,
    cells: primitives.cells.map((row) => row.map(({ color }) => color)),
  };
}

export class GetCurrentGridOrCreateNewOneUseCase {
  constructor(
    private readonly gridRepository: IGridRepository,
    private readonly gridQueries: IGridQueries,
  ) {}

  async execute(): Promise<GridDto> {
    // Todo: should implement active and inactive grids; for now, we just create a new grid if none exists
    const grid = await this.gridQueries.findLatestGrid();
    if (grid) {
      return grid;
    }

    const newGrid = Grid.withDimensions(32, 32);
    await this.gridRepository.save(newGrid);

    return toDto(newGrid);
  }
}
