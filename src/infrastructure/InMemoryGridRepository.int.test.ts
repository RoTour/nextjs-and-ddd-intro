// /Users/rotour/projects/back-to-react/src/infrastructure/InMemoryGridRepository.test.ts
import { describe, test, expect } from "vitest";
import { InMemoryGridRepository } from "./InMemoryGridRepository";
import { Grid } from "../domain/Grid.entity";
import { GridId } from "../domain/GridId.valueObject";
import { PlayerId } from "@/domain/PlayerId.valueObject";

describe("Infrastructure: InMemoryGridRepository", () => {
  test("should save a grid and retrieve it by its ID", async () => {
    // Arrange
    const repository = new InMemoryGridRepository();
    const grid = Grid.withDimensions(10, 10);
    const gridId = grid.id;

    // Act
    await repository.save(grid);
    const foundGrid = await repository.findById(gridId);

    // Assert
    expect(foundGrid).not.toBeNull();
    expect(foundGrid).toBeInstanceOf(Grid);
    // We use the .equals() method from our Value Object for comparison
    expect(foundGrid?.id.equals(gridId)).toBe(true);
  });

  test("should return null when a grid with the given ID is not found", async () => {
    // Arrange
    const repository = new InMemoryGridRepository();
    // Create an ID for a grid that is never saved
    const unsavedGridId = new GridId();

    // Act
    const foundGrid = await repository.findById(unsavedGridId);

    // Assert
    expect(foundGrid).toBeNull();
  });

  test("should update an existing grid when saved again", async () => {
    // Arrange
    const repository = new InMemoryGridRepository();
    const grid = Grid.withDimensions(5, 5);
    const gridId = grid.id;
    const playerId = new PlayerId();

    // Act: Save the initial state
    await repository.save(grid);

    // Modify the grid
    grid.changeCellColor(1, 1, "blue", playerId);

    // Save the modified grid
    await repository.save(grid);

    // Retrieve it again
    const foundGrid = await repository.findById(gridId);

    // Assert
    expect(foundGrid).not.toBeNull();
    expect(foundGrid?.cellAt(1, 1).currentColor()).toBe("blue");
  });
});
