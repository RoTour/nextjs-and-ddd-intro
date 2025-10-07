import { IGridQueries } from "../interfaces/IGridQueries";
import { GridDto } from "./GridDto";

type CanvasPageData = {
  grid: GridDto | null;
};

export class CanvasPageQueries {
  constructor(private readonly gridQueries: IGridQueries) {}

  public async getPageData(): Promise<CanvasPageData> {
    const grid = await this.gridQueries.findLatestGrid();
    return {
      grid,
    };
  }
}
