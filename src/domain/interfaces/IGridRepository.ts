import { Grid } from "../Grid.entity";
import { GridId } from "../GridId.valueObject";

export interface IGridRepository {
  findById(id: GridId): Promise<Grid | null>;
  save(grid: Grid): Promise<void>;
}
