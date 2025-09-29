import { Color } from "./Cell.entity";
import { IDomainEvent } from "./common/interfaces/IDomainEvent";
import { GridId } from "./GridId.valueObject";
import { PlayerId } from "./PlayerId.valueObject";

export class CellColorChanged implements IDomainEvent {
  public readonly occuredOn: Date;
  constructor(
    public readonly gridId: GridId,
    public readonly playerId: PlayerId,
    public readonly x: number,
    public readonly y: number,
    public readonly newColor: Color,
  ) {
    this.occuredOn = new Date();
  }
}
