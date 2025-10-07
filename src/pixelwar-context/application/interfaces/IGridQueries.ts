import { GridDto } from "../queries/GridDto";

export interface IGridQueries {
  findLatestGrid(): Promise<GridDto | null>;
}
