import { PlayerId } from "./PlayerId.valueObject";

export class Player {
  id: PlayerId;

  constructor(id?: PlayerId) {
    this.id = id ?? new PlayerId();
  }
}
