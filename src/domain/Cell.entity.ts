import { Position } from "./Position.valueObject";

export const availableColors = [
  "lightgray",
  "red",
  "green",
  "blue",
  "orange",
  "purple",
  "black",
  "white",
] as const;
export type Color = (typeof availableColors)[number];
export const ColorDefault = availableColors[0];

export class Cell {
  public readonly position: Position;
  private color: Color;

  constructor(position: Position, color: Color) {
    this.position = position;
    this.color = color;
  }

  public changeColor(newColor: Color) {
    const isExpectedColor = availableColors.includes(newColor); // TODO
    if (!isExpectedColor) {
      throw new TypeError(
        `Tried assigning invalid color [${newColor}] to cell [${this.position.x};${this.position.y}]`,
      );
    }
    this.color = newColor;
  }

  // The identity is defined by x and y
  public isSameAs(other: Cell): boolean {
    return (
      this.position.x === other.position.x &&
      this.position.y === other.position.y
    );
  }

  public currentColor(): Color {
    return this.color;
  }
}
