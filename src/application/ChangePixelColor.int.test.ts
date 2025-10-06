import { InMemoryGridRepository } from "@/infrastructure/repositories/InMemoryGridRepository";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { ChangePixelColorUseCase } from "./ChangePixelColor.usecase";
import { Grid } from "@/domain/Grid.entity";
import { IGridRepository } from "@/domain/interfaces/IGridRepository";
import { PlayerId } from "@/domain/PlayerId.valueObject";

describe("Int:ChangePixelColor", () => {
  let gridRepository: IGridRepository;
  let changePixelColorUseCase: ChangePixelColorUseCase;
  let grid: Grid;
  let playerId: PlayerId;

  beforeAll(() => {
    playerId = new PlayerId();
  });

  beforeEach(async () => {
    gridRepository = new InMemoryGridRepository();
    changePixelColorUseCase = new ChangePixelColorUseCase(gridRepository);
    grid = Grid.withDimensions(10, 10);
    await gridRepository.save(grid);
  });

  test("User should be blocked if trying to change cell before cooldown is down to 0", async () => {
    await changePixelColorUseCase.execute({
      color: "black",
      gridIdStr: grid.id.id(),
      playerIdStr: playerId.toString(),
      x: 1,
      y: 1,
    });

    await expect(() => {
      return changePixelColorUseCase.execute({
        color: "red",
        gridIdStr: grid.id.id(),
        playerIdStr: playerId.toString(),
        x: 2,
        y: 2,
      });
    }).rejects.toThrowError("Player is on cooldown");
  });
});
