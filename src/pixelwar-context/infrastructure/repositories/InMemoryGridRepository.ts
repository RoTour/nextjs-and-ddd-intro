import { Grid } from "@/pixelwar-context/domain/Grid.entity";
import { GridId } from "@/pixelwar-context/domain/GridId.valueObject";
import { IGridRepository } from "@/pixelwar-context/domain/interfaces/IGridRepository";

export class InMemoryGridRepository implements IGridRepository {
  private grids: Map<string, Grid>;

  constructor() {
    this.grids = new Map();
  }

  async findById(gridId: GridId): Promise<Grid | null> {
    const grid = this.grids.get(gridId.id());
    return grid || null;
  }

  async save(grid: Grid): Promise<void> {
    this.grids.set(grid.id.id(), grid);
  }
}
