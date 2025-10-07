// ChangePixelColor.usecase.ts
import { availableColors } from "@/pixelwar-context/domain/Cell.entity";
import { GridId } from "@/pixelwar-context/domain/GridId.valueObject";
import { IGridRepository } from "@/pixelwar-context/domain/interfaces/IGridRepository";
import { PlayerId } from "@/pixelwar-context/domain/PlayerId.valueObject";
import { z } from "zod";

// Define the "command" object schema
const ChangePixelColorCommandSchema = z.object({
  gridIdStr: z.string(),
  playerIdStr: z.string(),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  color: z.enum(availableColors), // We can be more specific here later
});

type ChangePixelColorCommand = z.infer<typeof ChangePixelColorCommandSchema>;

export class ChangePixelColorUseCase {
  constructor(private readonly gridRepository: IGridRepository) {}

  async execute(command: ChangePixelColorCommand) {
    const validationResult = ChangePixelColorCommandSchema.safeParse(command);
    if (!validationResult.success) {
      throw new Error("Invalid command");
    }

    const { gridIdStr, playerIdStr, x, y, color } = validationResult.data;

    const playerId = new PlayerId(playerIdStr);
    const gridId = new GridId(gridIdStr);

    const grid = await this.gridRepository.findById(gridId);

    if (!grid) {
      throw new Error("Grid not found");
    }

    grid.changeCellColor(x, y, color, playerId);

    await this.gridRepository.save(grid);
    console.debug("grid saved after color change", grid.id);
  }
}
