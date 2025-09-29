import { Grid } from "@/domain/Grid.entity";
import { IGridRepository } from "@/domain/interfaces/IGridRepository";
import z from "zod";

const GetCurrentGridOrCreateNewOneSchema = z.void();

type GetCurrentGridOrCreateNewOne = z.infer<
  typeof GetCurrentGridOrCreateNewOneSchema
>;

export class GetCurrentGridOrCreateNewOneUseCase {
  constructor(private readonly gridRepository: IGridRepository) {}

  async execute(): Promise<Grid> {
    // Todo: should implement active and inactive grids; for now, we just create a new grid if none exists
    const grid = Grid.withDimensions(32, 32);
    await this.gridRepository.save(grid);

    return grid;
  }
}
