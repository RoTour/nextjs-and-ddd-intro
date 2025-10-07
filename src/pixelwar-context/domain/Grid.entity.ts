import { Cell, Color, ColorDefault } from "./Cell.entity";
import { CellColorChanged } from "./CellColorChanged.event";
import { DomainEventPublisher } from "../../shared-kernel/events/DomainEventPublisher";
import { AggregateRoot } from "../../shared-kernel/interfaces/AggregateRoot";
import { PlayerOnCooldownError } from "./errors/PlayerOnCooldownError";
import { GridId } from "./GridId.valueObject";
import { PlayerId } from "./PlayerId.valueObject";
import { Position } from "./Position.valueObject";

const defaultWidth = 32;
const defaultHeight = 32;
const defaultColor = ColorDefault;
const PIXEL_COOLDOWN_MS = 1000 * 5; // 5 sec

export class Grid extends AggregateRoot<GridId> {
  private readonly cells: Cell[][];

  private playerLastEdits: Map<string, Date>;

  private constructor(
    id: GridId,
    cells: Cell[][],
    playerLastEdits?: Map<string, Date>,
  ) {
    super(id);
    this.cells = cells;
    this.playerLastEdits = playerLastEdits ?? new Map();
  }

  static withDimensions = (width = defaultWidth, height = defaultHeight) => {
    if (width <= 0) {
      throw new TypeError(`Grid width can't be 0 or inferior (got [${width}])`);
    }
    if (height <= 0) {
      throw new TypeError(
        `Grid height can't be 0 or inferior (got [${height}])`,
      );
    }
    const cells = this.createInitialGrid(width, height);
    return new Grid(new GridId(), cells);
  };

  private static createInitialGrid = (
    width: number,
    height: number,
  ): Cell[][] => {
    const newGrid: Cell[][] = [];

    for (let h = 0; h < height; h++) {
      newGrid.push([]);
      for (let w = 0; w < width; w++) {
        newGrid[h].push(new Cell(new Position(w, h), defaultColor));
      }
    }

    return newGrid;
  };

  public gridWidth = () => {
    return this.cells.at(0)!.length;
  };

  public gridHeight = () => {
    return this.cells.length;
  };

  public cellAt = (x: number, y: number) => {
    if (!this.areCoordinatesValid(x, y)) {
      throw new Error("Coordinates are outside the grid boundaries.");
    }
    return this.cells.at(y)!.at(x)!;
  };

  public changeCellColor(
    x: number,
    y: number,
    newColor: Color,
    playerId: PlayerId,
  ) {
    if (!this.areCoordinatesValid(x, y)) {
      throw new Error("Coordinates are outside the grid boundaries.");
    }

    this.assertPlayerIsNotOnCooldown(playerId);

    const cell = this.cells[y][x];
    cell.changeColor(newColor);

    this.playerLastEdits.set(playerId.id(), new Date());

    DomainEventPublisher.publish(
      new CellColorChanged(this.id, playerId, x, y, newColor),
    );
  }

  private areCoordinatesValid(x: number, y: number): boolean {
    return x >= 0 && x < this.gridWidth() && y >= 0 && y < this.gridHeight();
  }

  private assertPlayerIsNotOnCooldown(playerId: PlayerId) {
    const lastAction = this.playerLastEdits.get(playerId.id());

    if (lastAction) {
      const timeSince = new Date().getTime() - lastAction.getTime();

      if (timeSince < PIXEL_COOLDOWN_MS) {
        const cooldownRemaining = PIXEL_COOLDOWN_MS - timeSince;
        throw new PlayerOnCooldownError(cooldownRemaining);
      }
    }
  }

  /**
   * [NEW] A static factory to reconstitute a Grid from persisted data.
   */
  public static reconstitute(primitiveGrid: {
    id: string;
    cells: { x: number; y: number; color: Color }[][];
    playerLastEdits: { [playerId: string]: string };
  }): Grid {
    const cells: Cell[][] = primitiveGrid.cells.map((row) =>
      row.map(
        (cellData) =>
          new Cell(new Position(cellData.x, cellData.y), cellData.color),
      ),
    );

    return new Grid(
      new GridId(primitiveGrid.id),
      cells,
      new Map(
        Object.entries(primitiveGrid.playerLastEdits).map(([key, value]) => [
          key,
          new Date(value),
        ]),
      ),
    );
  }

  /**
   * [NEW] A method to convert the entity's state to a plain, storable object.
   */
  public toPrimitives() {
    const cellPrimitives = this.cells.map((row) =>
      row.map((cell) => ({
        x: cell.position.x,
        y: cell.position.y,
        color: cell.currentColor(),
      })),
    );

    const playerLastEditsPrimitives = Object.fromEntries(
      Array.from(this.playerLastEdits.entries()).map(([key, value]) => [
        key,
        value.toISOString(),
      ]),
    );

    return {
      id: this.id.id(),
      cells: cellPrimitives,
      playerLastEdits: playerLastEditsPrimitives,
    };
  }
}
