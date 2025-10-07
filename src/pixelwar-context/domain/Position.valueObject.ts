export class Position {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    if (x < 0 || y < 0) {
      throw new TypeError("Coordinates cannot be negative.");
    }
    this.x = x;
    this.y = y;
  }

  public equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
