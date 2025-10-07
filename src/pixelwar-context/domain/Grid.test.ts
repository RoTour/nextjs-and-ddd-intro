import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Grid } from "./Grid.entity";
import { Player } from "./Player.entity";
import { CellColorChanged } from "./CellColorChanged.event";
import { IDomainEvent } from "../../shared-kernel/interfaces/IDomainEvent";
import { IDomainEventListener } from "../../shared-kernel/interfaces/IDomainEventListener";
import { PlayerOnCooldownError } from "./errors/PlayerOnCooldownError";
import { DomainEventPublisher } from "../../shared-kernel/events/DomainEventPublisher";

class TestListener implements IDomainEventListener {
  public event: IDomainEvent | null = null;
  public callCount = 0;

  handle(event: IDomainEvent): void {
    this.event = event;
    this.callCount++;
  }
}

describe("Domain:Grid Entity", () => {
  const player: Player = new Player();
  let testListener: TestListener;

  beforeEach(() => {
    vi.useFakeTimers();
    // 2. Before each test, create a fresh listener and subscribe it.
    testListener = new TestListener();
    DomainEventPublisher.subscribe(testListener);
  });

  afterEach(() => {
    vi.useRealTimers();
    // 3. After each test, reset the publisher to remove all listeners.
    DomainEventPublisher.reset();
  });

  test("Grid size should match provided values", () => {
    const grid = Grid.withDimensions(15, 10);

    expect(grid.gridWidth()).toBe(15);
    expect(grid.gridHeight()).toBe(10);

    const biggerGrid = Grid.withDimensions(30, 33);

    expect(biggerGrid.gridWidth()).toBe(30);
    expect(biggerGrid.gridHeight()).toBe(33);
  });

  test("Changing color should target the correct cell", () => {
    const grid = Grid.withDimensions(5, 5);
    grid.changeCellColor(1, 2, "black", player.id);

    // X and Y are inverted because of nested array
    expect(grid.cellAt(1, 2).currentColor()).toBe("black");
  });

  test("Changing color should be blocked if player is on cd", () => {
    const grid = Grid.withDimensions(5, 5);
    grid.changeCellColor(1, 2, "black", player.id);

    expect(() => {
      grid.changeCellColor(2, 2, "red", player.id);
    }).toThrow(PlayerOnCooldownError);
  });

  describe("Domain Events Publishing", () => {
    test("should notify a subscribed listener when a cell color is changed", () => {
      // Arrange
      const grid = Grid.withDimensions(5, 5);

      // Act
      grid.changeCellColor(1, 2, "blue", player.id);

      // 4. Assert by checking the state of our mock listener.
      expect(testListener.callCount).toBe(1);
      expect(testListener.event).toBeInstanceOf(CellColorChanged);
    });

    test("should provide the correct payload to the listener", () => {
      // Arrange
      const grid = Grid.withDimensions(10, 10);

      // Act
      grid.changeCellColor(3, 4, "green", player.id);

      // Assert
      const publishedEvent = testListener.event as CellColorChanged;
      expect(publishedEvent.gridId).toBe(grid.id);
      expect(publishedEvent.playerId).toBe(player.id);
      expect(publishedEvent.x).toBe(3);
      expect(publishedEvent.y).toBe(4);
      expect(publishedEvent.newColor).toBe("green");
    });

    test("should NOT notify a listener if the action fails due to cooldown", () => {
      // Arrange
      const grid = Grid.withDimensions(5, 5);
      grid.changeCellColor(0, 0, "red", player.id);
      expect(testListener.callCount).toBe(1); // Verify the first event was handled

      // Act & Assert
      expect(() => {
        grid.changeCellColor(1, 1, "blue", player.id);
      }).toThrow(PlayerOnCooldownError);

      // Assert that the listener was not called a second time
      expect(testListener.callCount).toBe(1);
    });
  });

  describe("Serialization", () => {
    test("transforming to primitive then to object should recreate a copy", () => {
      // Arrange
      const grid = Grid.withDimensions(3, 3);
      const playerId = player.id;
      grid.changeCellColor(0, 2, "red", playerId);

      // Act
      const primitive = grid.toPrimitives();
      const recreatedGrid = Grid.reconstitute(primitive);

      // Assert
      expect(recreatedGrid.gridWidth()).toBe(grid.gridWidth());
      expect(recreatedGrid.gridHeight()).toBe(grid.gridHeight());
      for (let y = 0; y < grid.gridHeight(); y++) {
        for (let x = 0; x < grid.gridWidth(); x++) {
          expect(recreatedGrid.cellAt(x, y).currentColor()).toBe(
            grid.cellAt(x, y).currentColor(),
          );
        }
      }
    });
  });
});
